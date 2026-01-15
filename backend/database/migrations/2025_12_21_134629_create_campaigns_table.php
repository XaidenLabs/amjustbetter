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
        Schema::create('campaigns', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignId('organizer_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('beneficiary_id')->nullable()->constrained('users')->nullOnDelete();
            $table->string('title');
            $table->string('slug')->unique();
            $table->longText('description');
            $table->decimal('goal_amount', 15, 2);
            $table->decimal('total_raised', 15, 2)->default(0);
            $table->enum('status', ['DRAFT', 'PUBLISHED', 'SUSPENDED', 'COMPLETED'])->default('DRAFT');
            $table->enum('audit_status', ['UNREVIEWED', 'FLAGGED', 'CLEARED'])->default('UNREVIEWED');
            $table->string('image_path')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('campaigns');
    }
};
