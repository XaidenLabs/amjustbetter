<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Campaign;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Donation>
 */
class DonationFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'campaign_id' => Campaign::factory(),
            'donor_name' => $this->faker->name,
            'donor_email' => $this->faker->email,
            'amount_gross' => 50.00,
            'amount_net' => 45.00,
            'payment_status' => 'PAID',
            'stripe_payment_intent_id' => 'pi_' . $this->faker->uuid,
            'frequency' => 'one-time',
        ];
    }
}
