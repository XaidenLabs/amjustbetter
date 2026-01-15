<?php

use App\Http\Controllers\CampaignController;
use App\Http\Controllers\StripeController;
use App\Http\Controllers\DonationController;

use App\Http\Controllers\WebhookController;
use App\Http\Controllers\AdminVerificationController;
use App\Http\Controllers\AdminDonationController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\AdminController;


Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::get('/campaigns/{slug}', [CampaignController::class, 'show']);
Route::get('/campaigns/{id}/updates', [\App\Http\Controllers\CampaignUpdateController::class, 'index']);

// Public Donation Routes
Route::post('/paystack/initialize', [\App\Http\Controllers\PaystackController::class, 'initialize']);
Route::get('/paystack/verify', [\App\Http\Controllers\PaystackController::class, 'verify']);
Route::post('/donations', [DonationController::class, 'store']); // Keep for manual testing if needed, or remove? User asked to remove Stripe/PayPal. Let's keep generic 'store' for debug but rely on verify.


Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user/campaigns', [CampaignController::class, 'userCampaigns']);
    Route::get('/campaigns/id/{id}', [CampaignController::class, 'showById']);
    Route::post('/campaigns', [CampaignController::class, 'store']);
    
    // Campaign Updates
    Route::post('/campaigns/{id}/updates', [\App\Http\Controllers\CampaignUpdateController::class, 'store']);


    Route::get('/user', function (Request $request) {
        return $request->user();
    });
    
    // User Routes
    Route::middleware('role:user')->group(function () {
        Route::get('/dashboard/user', [UserController::class, 'index']);
    });

    // Admin Routes
    Route::middleware('role:admin')->group(function () {
        Route::get('/dashboard/admin', [AdminController::class, 'index']);
        
        // Verification
        Route::get('/admin/verifications', [AdminVerificationController::class, 'index']);
        Route::post('/admin/verifications/{id}/approve', [AdminVerificationController::class, 'approve']);
        Route::post('/admin/verifications/{id}/reject', [AdminVerificationController::class, 'reject']);
        
        // Offline Donations
        Route::post('/admin/donations/offline', [AdminDonationController::class, 'storeOffline']);
    });
});
