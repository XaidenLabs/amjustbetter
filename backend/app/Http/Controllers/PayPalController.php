<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Campaign;
use App\Models\Donation;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class PayPalController extends Controller
{
    private $clientId;
    private $clientSecret;
    private $baseUrl;

    public function __construct()
    {
        $this->clientId = env('PAYPAL_CLIENT_ID');
        $this->clientSecret = env('PAYPAL_CLIENT_SECRET');
        $this->baseUrl = env('PAYPAL_MODE') === 'live' 
            ? 'https://api-m.paypal.com' 
            : 'https://api-m.sandbox.paypal.com';
    }

    private function getAccessToken()
    {
        $response = Http::withBasicAuth($this->clientId, $this->clientSecret)
            ->asForm()
            ->post("{$this->baseUrl}/v1/oauth2/token", [
                'grant_type' => 'client_credentials',
            ]);

        if ($response->failed()) {
            throw new \Exception('PayPal Auth Failed');
        }

        return $response->json()['access_token'];
    }

    public function createOrder(Request $request)
    {
        $validated = $request->validate([
            'campaign_id' => 'required|exists:campaigns,id',
            'amount_cents' => 'required|integer|min:100', // PayPal uses decimals, so we convert
        ]);

        try {
            $accessToken = $this->getAccessToken();
            $amount = number_format($validated['amount_cents'] / 100, 2, '.', '');
            
            $response = Http::withToken($accessToken)
                ->post("{$this->baseUrl}/v2/checkout/orders", [
                    'intent' => 'CAPTURE',
                    'purchase_units' => [[
                        'amount' => [
                            'currency_code' => 'USD',
                            'value' => $amount,
                        ],
                        'reference_id' => $validated['campaign_id'] // to track
                    ]],
                ]);
            
            return $response->json();
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function captureOrder(Request $request)
    {
        $validated = $request->validate([
            'orderID' => 'required|string',
            'campaign_id' => 'required',
            'email' => 'required|email',
            'amount_cents' => 'required|integer',
            'comment' => 'nullable|string|max:500'
        ]);

        try {
            $accessToken = $this->getAccessToken();
            $response = Http::withToken($accessToken)
                ->post("{$this->baseUrl}/v2/checkout/orders/{$validated['orderID']}/capture", [
                    'headers' => [
                        'Content-Type' => 'application/json'
                    ]
                ]);

            if ($response->successful()) {
                $data = $response->json();
                
                // Verify status is COMPLETED
                if ($data['status'] === 'COMPLETED') {
                     // Record Donation
                     $donation = Donation::create([
                        'campaign_id' => $validated['campaign_id'],
                        'donor_email' => $validated['email'],
                        'amount_gross' => $validated['amount_cents'] / 100,
                        'amount_net' => ($validated['amount_cents'] / 100) * 0.95, // Approx fees
                        'payment_status' => 'PAID',
                        'stripe_payment_intent_id' => 'PAYPAL_' . $validated['orderID'], // storing paypal ID here for now
                        'source_type' => 'paypal',
                        'frequency' => 'one-time',
                        'comment' => $validated['comment'] ?? null,
                    ]);

                    // Update Campaign
                    $campaign = Campaign::find($validated['campaign_id']);
                    $campaign->increment('total_raised', $validated['amount_cents'] / 100);

                    // Send Emails
                    try {
                        \Illuminate\Support\Facades\Mail::to($donation->donor_email)->send(new \App\Mail\DonationMerci($donation));
                        if ($campaign->organizer && $campaign->organizer->email) {
                            \Illuminate\Support\Facades\Mail::to($campaign->organizer->email)->send(new \App\Mail\DonationReceived($donation));
                        }
                    } catch (\Exception $e) {
                         Log::error('Email sending failed: ' . $e->getMessage());
                    }

                    return response()->json($donation, 201);
                }
            }
            
            return response()->json(['error' => 'Capture failed or not completed'], 400);

        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}
