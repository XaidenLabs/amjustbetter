<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use App\Models\Donation;
use App\Models\Campaign;
use Illuminate\Support\Facades\Log;

class PaystackController extends Controller
{
    public function initialize(Request $request)
    {
        $validated = $request->validate([
            'email' => 'required|email',
            'amount_cents' => 'required|integer',
            'campaign_id' => 'required|exists:campaigns,id',
            'is_anonymous' => 'boolean',
            'comment' => 'nullable|string'
        ]);

        $amount = $validated['amount_cents']; // Paystack expects kobo (cents) generally, but let's double check. Yes, lowest currency unit.
        
        // Metadata to pass through to webhook/verification
        $metadata = [
            'campaign_id' => $validated['campaign_id'],
            'is_anonymous' => $validated['is_anonymous'] ?? false,
            'comment' => $validated['comment'] ?? null,
            'fees' => true // Custom flag if needed
        ];

        try {
            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . env('PAYSTACK_SECRET_KEY'),
                'Content-Type' => 'application/json',
            ])->post('https://api.paystack.co/transaction/initialize', [
                'email' => $validated['email'],
                'amount' => $amount,
                'callback_url' => env('NEXT_PUBLIC_APP_URL', 'http://localhost:3000') . '/donation/success', // Frontend success page
                'metadata' => $metadata
            ]);

            if ($response->successful()) {
                return response()->json($response->json()['data']);
            } else {
                Log::error('Paystack Init Failed', $response->json());
                return response()->json(['error' => 'Payment initialization failed'], 400);
            }
        } catch (\Exception $e) {
            Log::error('Paystack Error: ' . $e->getMessage());
            return response()->json(['error' => 'Connection error'], 500);
        }
    }

    public function verify(Request $request)
    {
        $reference = $request->query('reference') ?? $request->input('reference');

        if (!$reference) {
            return response()->json(['error' => 'No reference provided'], 400);
        }

        try {
            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . env('PAYSTACK_SECRET_KEY'),
                'Content-Type' => 'application/json',
            ])->get("https://api.paystack.co/transaction/verify/{$reference}");

            if ($response->successful()) {
                $data = $response->json()['data'];

                if ($data['status'] === 'success') {
                    // Record Donation
                    // Check if already exists to prevent duplicates
                    $existing = Donation::where('stripe_payment_intent_id', $reference)->first(); // We can reuse this column or add a new one. Let's reuse for now to save migration time or add new column column 'transaction_reference' is cleaner.
                    // Actually, let's reuse 'stripe_payment_intent_id' as 'transaction_id' essentially.
                    
                    if ($existing) {
                        return response()->json(['message' => 'Donation already recorded', 'donation' => $existing]);
                    }

                    $metadata = $data['metadata'];
                    $campaign = Campaign::find($metadata['campaign_id']);

                    $donation = Donation::create([
                        'campaign_id' => $campaign->id,
                        'donor_email' => $data['customer']['email'],
                        'amount_gross' => $data['amount'] / 100,
                        'amount_net' => ($data['amount'] / 100) * 0.985, // Approx fee deduction, refine later
                        'payment_status' => 'PAID',
                        'stripe_payment_intent_id' => $reference, // Storing paystack ref here
                        'is_anonymous' => $metadata['is_anonymous'] ?? false,
                        'comment' => $metadata['comment'] ?? null,
                    ]);

                    $campaign->increment('total_raised', $donation->amount_gross);

                    // Send Emails (Copied from DonationController)
                    try {
                        \Illuminate\Support\Facades\Mail::to($donation->donor_email)->send(new \App\Mail\DonationMerci($donation));
                        if ($campaign->organizer && $campaign->organizer->email) {
                            \Illuminate\Support\Facades\Mail::to($campaign->organizer->email)->send(new \App\Mail\DonationReceived($donation));
                        }
                    } catch (\Exception $e) {
                        Log::error('Email sending failed: ' . $e->getMessage());
                    }

                    return response()->json(['status' => 'success', 'donation' => $donation]);
                } else {
                    return response()->json(['error' => 'Transaction not successful'], 400);
                }
            } else {
                return response()->json(['error' => 'Verification failed'], 400);
            }
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}
