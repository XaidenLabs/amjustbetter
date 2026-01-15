<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Stripe\Stripe;
use Stripe\Subscription;
use App\Models\Campaign;
use App\Models\Donation;

class SubscriptionController extends Controller
{
    public function __construct()
    {
        Stripe::setApiKey(env('STRIPE_SECRET_KEY'));
    }

    public function createSubscription(Request $request)
    {
        $validated = $request->validate([
            'campaign_id' => 'required|exists:campaigns,id',
            'amount_cents' => 'required|integer|min:100',
            'email' => 'required|email',
            'payment_method_id' => 'required|string',
        ]);

        $campaign = Campaign::findOrFail($validated['campaign_id']);

        // In a real app, we'd create a Stripe Customer first or find existing
        $customer = \Stripe\Customer::create([
            'email' => $validated['email'],
            'payment_method' => $validated['payment_method_id'],
            'invoice_settings' => ['default_payment_method' => $validated['payment_method_id']],
        ]);

        // Create a product/price dynamically or use a standard one.
        // For MVP, we'll create a Price on the fly (not optimal for scale but works for "God mode" speed)
        // Actually, Stripe allows 'price_data' in subscriptions too? No, usually separate.
        // Let's assume we create a Price for this donation.

        $price = \Stripe\Price::create([
            'unit_amount' => $validated['amount_cents'],
            'currency' => 'usd',
            'recurring' => ['interval' => 'month'],
            'product_data' => [
                'name' => 'Monthly Donation to ' . $campaign->title,
            ],
        ]);

        $subscription = Subscription::create([
            'customer' => $customer->id,
            'items' => [['price' => $price->id]],
            'payment_settings' => ['save_default_payment_method' => 'on_subscription'],
            'expand' => ['latest_invoice.payment_intent'],
            'transfer_data' => [
                'destination' => $campaign->organizer->stripe_account_id,
            ],
            // Application fee for platform?
            // 'application_fee_percent' => 5, // Example
            'metadata' => [
                'campaign_id' => $campaign->id,
                'donor_email' => $validated['email'],
                'type' => 'donation_subscription'
            ]
        ]);
        
        // We should record this donation/subscription in DB
        // ...

        return response()->json([
            'subscriptionId' => $subscription->id,
            'clientSecret' => $subscription->latest_invoice->payment_intent->client_secret,
        ]);
    }
}
