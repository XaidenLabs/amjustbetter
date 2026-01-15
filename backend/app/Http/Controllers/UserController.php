<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class UserController extends Controller
{
    public function index()
    {
        return response()->json([
            'message' => 'Welcome to the User Dashboard',
            'data' => [
                'recent_activity' => 'Donated $50',
                'status' => 'Active Member'
            ]
        ]);
    }
}
