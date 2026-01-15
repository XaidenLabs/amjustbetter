<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;


use App\Models\User;

class AdminVerificationController extends Controller
{
    public function index()
    {
        // List users waiting for verification
        return User::whereIn('kyc_status', ['PENDING', 'MANUAL_REVIEW'])
            ->latest()
            ->paginate(20);
    }

    public function approve($id)
    {
        $user = User::findOrFail($id);
        
        $user->kyc_status = 'VERIFIED';
        $user->save();
        
        // TODO: Send email notification "You are verified!"
        
        return response()->json(['message' => 'User verified successfully', 'user' => $user]);
    }

    public function reject(Request $request, $id)
    {
        $request->validate([
            'reason' => 'required|string|max:255',
        ]);

        $user = User::findOrFail($id);
        
        $user->kyc_status = 'REJECTED';
        // We might store the rejection reason in a separate log or column if needed.
        // For now, just logging it or assuming it triggers an email with the reason.
        $user->save();
        
        // TODO: Send email notification "Verification rejected: " . $request->reason
        
        return response()->json(['message' => 'User rejected', 'user' => $user]);
    }
}
