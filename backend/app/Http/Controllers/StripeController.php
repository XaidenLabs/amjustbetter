<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;


use Stripe\Stripe;
use Stripe\Account;
use Stripe\AccountLink;

class StripeController extends Controller
{
    public function __construct()
    {
        Stripe::setApiKey(env('STRIPE_SECRET_KEY'));
    }

    public function connect(Request $request)
    {
        $user = $request->user();

        if (! $user->stripe_account_id) {
            $account = Account::create([
                'type' => 'express',
                'country' => 'US', 
                'email' => $user->email,
                'capabilities' => [
                  'card_payments' => ['requested' => true],
                  'transfers' => ['requested' => true],
                ],
            ]);

            $user->stripe_account_id = $account->id;
            $user->save();
        }

        $accountLink = AccountLink::create([
            'account' => $user->stripe_account_id,
            'refresh_url' => env('FRONTEND_URL') . '/dashboard/user', // TODO: specialised error page?
            'return_url' => env('FRONTEND_URL') . '/stripe/callback', 
            'type' => 'account_onboarding',
        ]);

        return response()->json(['url' => $accountLink->url]);
    }

    public function callback(Request $request)
    {
        // Frontend hits this after Stripe redirect, we just need to verify status if needed
        // But mainly the frontend should just call an endpoint to say "I'm back, check my status"
        // or simply redirect to dashboard.
        // For API flow, frontend handles the return_url route and might call this to sync status.
        return response()->json(['status' => 'success']);
    }

    public function dashboard(Request $request)
    {
        $user = $request->user();

        if (! $user->stripe_account_id) {
            return response()->json(['error' => 'No connected account'], 400);
        }

        $loginLink = \Stripe\Account::createLoginLink($user->stripe_account_id);

        return response()->json(['url' => $loginLink->url]);
    }
}
