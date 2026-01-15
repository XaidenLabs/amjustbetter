<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('donations', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('campaign_id')->constrained('campaigns')->cascadeOnDelete();
            $table->foreignId('donor_id')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignId('admin_uploaded_by')->nullable()->constrained('users')->nullOnDelete();
            
            $table->string('donor_email')->nullable();
            $table->string('donor_name')->nullable();
            
            $table->decimal('amount_gross', 15, 2);
            $table->decimal('amount_net', 15, 2);
            $table->decimal('platform_tip', 15, 2)->default(0);
            $table->decimal('processor_fee', 15, 2)->default(0);
            
            $table->enum('payment_status', ['SUCCEEDED', 'FAILED', 'REFUNDED', 'DISPUTED']);
            $table->string('stripe_payment_intent_id')->nullable();
            $table->enum('source_type', ['ONLINE_CARD', 'OFFLINE_CHECK', 'OFFLINE_CASH']);
            
            $table->boolean('is_anonymous')->default(false);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('donations');
    }
};
