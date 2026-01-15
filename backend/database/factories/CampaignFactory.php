<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\User;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Campaign>
 */
class CampaignFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'organizer_id' => User::factory(), // Assuming User factory exists (default Laravel)
            'beneficiary_id' => User::factory(),
            'title' => $this->faker->sentence,
            'slug' => $this->faker->slug,
            'description' => $this->faker->paragraph,
            'goal_amount' => $this->faker->numberBetween(1000, 10000),
            'total_raised' => 0,
            'status' => 'active',
            'deadline' => $this->faker->dateTimeBetween('+1 month', '+2 months'),
        ];
    }
}
