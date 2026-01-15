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
        Schema::table('users', function (Blueprint $table) {
            $table->string('stripe_account_id')->nullable()->after('password');
            $table->enum('kyc_status', ['PENDING', 'VERIFIED', 'REJECTED', 'MANUAL_REVIEW'])
                  ->default('PENDING')
                  ->after('stripe_account_id');
            $table->boolean('is_admin')->default(false)->after('kyc_status');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['stripe_account_id', 'kyc_status', 'is_admin']);
        });
    }
};
