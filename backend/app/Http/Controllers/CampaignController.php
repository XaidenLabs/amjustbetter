<?php

namespace App\Http\Controllers;

use App\Models\Campaign;
use App\Http\Requests\StoreCampaignRequest;
use Illuminate\Http\Request;

class CampaignController extends Controller
{
    public function index()
    {
        // Public feed: only published
        return Campaign::where('status', 'PUBLISHED')
            ->latest()
            ->paginate(12);
    }

    public function store(StoreCampaignRequest $request)
    {
        $validated = $request->validated();
        
        $organizer = $request->user();
        
        // Slug generation
        $slug = \Illuminate\Support\Str::slug($validated['title']) . '-' . \Illuminate\Support\Str::random(6);
        
        $beneficiaryId = null;
        if ($validated['beneficiary_action'] === 'myself') {
            $beneficiaryId = $organizer->id;
        }
        // "Next steps" for 'someone_else' would handle the invite logic here using 'beneficiary_email'

        $path = null;
        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('campaigns', 'public');
        }

        $campaign = Campaign::create([
            'organizer_id' => $organizer->id,
            'beneficiary_id' => $beneficiaryId,
            'title' => $validated['title'],
            'slug' => $slug,
            'description' => $validated['description'],
            'goal_amount' => $validated['goal_amount'],
            'image_path' => $path,
            'category' => $request->input('category', 'Other'),
            // Default to PUBLISHED for MVP per plan logic
            'status' => 'PUBLISHED',  
        ]);

        return response()->json($campaign, 201);
    }

    public function show($slug)
    {
        $campaign = Campaign::where('slug', $slug)
            ->with(['organizer:id,name', 'beneficiary:id,name'])
            ->firstOrFail();

        // Load recent donations
        $campaign->load(['donations' => function($q) {
            $q->where('payment_status', 'PAID')->latest()->limit(5);
        }]);
        
        // Add top donors manually to the object
        $campaign->setRelation('topDonors', $campaign->donations()->where('payment_status', 'PAID')->orderByDesc('amount_gross')->limit(5)->get());

        return $campaign;
    }

    public function userCampaigns(Request $request)
    {
        return Campaign::where('organizer_id', $request->user()->id)
            ->latest()
            ->get();
    }
    
    public function showById($id)
    {
        return Campaign::with(['organizer:id,name', 'donations' => function($q) {
             $q->where('payment_status', 'PAID')->latest();
        }])->findOrFail($id);
    }
}
