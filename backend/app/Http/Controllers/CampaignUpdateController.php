<?php

namespace App\Http\Controllers;

use App\Models\Campaign;
use App\Models\CampaignUpdate;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class CampaignUpdateController extends Controller
{
    public function index($campaignId)
    {
        $updates = CampaignUpdate::where('campaign_id', $campaignId)->latest()->get();
        return response()->json($updates);
    }

    public function store(Request $request, $campaignId)
    {
        $campaign = Campaign::findOrFail($campaignId);

        // Authorization: strict check or rely on middleware. 
        // For MVP/Demo correctness, check if auth user is organizer.
        if ($request->user()->id !== $campaign->organizer_id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'image' => 'nullable|image|max:2048' // 2MB max
        ]);

        $imagePath = null;
        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('updates', 'public');
        }

        $update = CampaignUpdate::create([
            'campaign_id' => $campaignId,
            'title' => $validated['title'],
            'content' => $validated['content'],
            'image_path' => $imagePath
        ]);

        return response()->json($update, 201);
    }
}
