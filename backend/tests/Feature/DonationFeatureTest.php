<?php

namespace Tests\Feature;

use App\Models\Campaign;
use App\Models\Donation;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Mail;
use Tests\TestCase;

class DonationFeatureTest extends TestCase
{
    use RefreshDatabase;

    public function test_can_create_paypal_order()
    {
        Http::fake([
            'paypal.com/*' => Http::response(['access_token' => 'fake_token'], 200),
            '*/v2/checkout/orders' => Http::response(['id' => 'fake_order_id'], 201),
        ]);

        $campaign = Campaign::factory()->create();

        $response = $this->postJson('/api/paypal/create-order', [
            'campaign_id' => $campaign->id,
            'amount_cents' => 5000
        ]);

        $response->assertStatus(200)
            ->assertJson(['id' => 'fake_order_id']);
    }

    public function test_capture_paypal_order_creates_donation_and_sends_email()
    {
        Mail::fake();
        Http::fake([
            'paypal.com/*' => Http::response(['access_token' => 'fake_token'], 200),
            '*/capture' => Http::response(['status' => 'COMPLETED'], 200),
        ]);

        $campaign = Campaign::factory()->create();

        $response = $this->postJson('/api/paypal/capture-order', [
            'orderID' => 'fake_order_id',
            'campaign_id' => $campaign->id,
            'email' => 'donor@example.com',
            'amount_cents' => 5000
        ]);

        $response->assertStatus(201);

        $this->assertDatabaseHas('donations', [
            'campaign_id' => $campaign->id,
            'donor_email' => 'donor@example.com',
            'amount_gross' => 50.00,
            'payment_status' => 'PAID',
            'source_type' => 'paypal'
        ]);

        Mail::assertQueued(\App\Mail\DonationMerci::class);
        if ($campaign->organizer) {
             Mail::assertQueued(\App\Mail\DonationReceived::class);
        }
    }
}
