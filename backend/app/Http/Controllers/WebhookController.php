<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;


use Stripe\Webhook;
use Stripe\Exception\SignatureVerificationException;
use App\Models\Donation;
use App\Models\Campaign;

class WebhookController extends Controller
{
    public function handleStripe(Request $request)
    {
        $payload = $request->getContent();
        $sig_header = $request->header('Stripe-Signature');
        $endpoint_secret = env('STRIPE_WEBHOOK_SECRET');

        try {
            $event = Webhook::constructEvent(
                $payload, $sig_header, $endpoint_secret
            );
        } catch(SignatureVerificationException $e) {
            return response()->json(['error' => 'Invalid signature'], 400);
        }

        if ($event->type == 'payment_intent.succeeded') {
            $paymentIntent = $event->data->object;
            
            $donation = Donation::where('stripe_payment_intent_id', $paymentIntent->id)
                ->first(); // If we stored it during intent creation?
            
            // Wait, createPaymentIntent DOES NOT create a Donation record yet in my generic implementation plan.
            // My implementation plan said: "Find Donation by stripe_payment_intent_id (or metadata)".
            // BUT `DonationController` only returned secret, it didn't create a DB record.
            
            // Correction: Robust systems usually create a "PENDING" record first.
            // OR we create it here from metadata.
            // Let's create it here if it doesn't exist, using metadata.
            
            if (! $donation) {
                // Create from metadata
                $meta = $paymentIntent->metadata;
                
                $donation = Donation::create([
                    'id' => \Illuminate\Support\Str::uuid(),
                    'campaign_id' => $meta->campaign_id,
                    'donor_email' => $meta->donor_email,
                    // 'donor_id' => // If we passed user ID in metadata, which we didn't in DonationController yet.
                    'amount_gross' => $paymentIntent->amount / 100, // Cents to Dollars
                    'amount_net' => ($paymentIntent->amount - ($paymentIntent->application_fee_amount ?? 0)) / 100, // Roughly
                    'platform_tip' => ($paymentIntent->application_fee_amount ?? 0) / 100,
                    'stripe_payment_intent_id' => $paymentIntent->id,
                    'payment_status' => 'SUCCEEDED',
                    'source_type' => 'ONLINE_CARD',
                    'is_anonymous' => $meta->is_anonymous,
                ]);

                // Update Campaign Total
                $campaign = Campaign::find($meta->campaign_id);
                if ($campaign) {
                    $campaign->increment('total_raised', (float) $donation->amount_gross); // or net? Spec says "Total Raised" usually means Gross.
                }
            } else {
                // Idempotency: already processed?
                if ($donation->payment_status !== 'SUCCEEDED') {
                    $donation->update(['payment_status' => 'SUCCEEDED']);
                    $donation->campaign->increment('total_raised', (float) $donation->amount_gross);
                }
            }
        }

        return response()->json(['status' => 'success']);
    }
}
