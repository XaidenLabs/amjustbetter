<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;

class AdminController extends Controller
{
    public function index()
    {
        $usersCount = User::count();
        $adminsCount = User::where('role', 'admin')->count();

        return response()->json([
            'message' => 'Welcome to the Admin Dashboard',
            'data' => [
                'total_users' => $usersCount,
                'total_admins' => $adminsCount,
                'system_status' => 'Optimal'
            ]
        ]);
    }
}
