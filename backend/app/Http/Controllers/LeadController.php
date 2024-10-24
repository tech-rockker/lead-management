<?php

namespace App\Http\Controllers;

use App\Models\Lead;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Validation\ValidationException;

class LeadController extends Controller
{
    /**
     * Display a paginated list of leads with caching.
     */
    public function index(Request $request)
    {
        // Get per-page value from request or default to 20
        $perPage = min(max((int) $request->input('per_page', 20), 1), 100);
        
        // Generate a unique cache key based on the pagination value
        $cacheKey = "leads_page_{$request->input('page', 1)}_per_page_{$perPage}";

        // Try to retrieve cached data or cache the query result for 10 minutes
        $leads = Cache::remember($cacheKey, 600, function () use ($perPage) {
            return Lead::with('status')->paginate($perPage);
        });

        return response()->json($leads);
    }

    /**
     * Store a newly created lead in storage.
     */
    public function store(Request $request)
    {
        try {
            $validated = $this->validateLead($request);

            // Create new lead
            $lead = Lead::create($validated);

            // Clear cache related to lead listings after storing a new lead
            Cache::forget('leads_page_*');  // Clear all cached pages of lead list
            
            return response()->json([
                'message' => 'Lead created successfully',
                'lead' => $lead
            ], 201);

        } catch (ValidationException $e) {
            return response()->json([
                'errors' => $e->errors()
            ], 422);
        }
    }

    /**
     * Update an existing lead.
     */
    public function update(Request $request, Lead $lead)
    {
        try {
            $validated = $this->validateLead($request, $lead->id);

            // Update the lead
            $lead->update($validated);

            // Clear cache related to lead listings after updating a lead
            Cache::forget('leads_page_*');  // Clear all cached pages of lead list
            
            return response()->json([
                'message' => 'Lead updated successfully',
                'lead' => $lead->load('status')
            ]);

        } catch (ValidationException $e) {
            return response()->json([
                'errors' => $e->errors()
            ], 422);
        }
    }

    /**
     * Remove a lead from storage.
     */
    public function destroy(Lead $lead)
    {
        $lead->delete();

        // Clear cache related to lead listings after deleting a lead
        Cache::forget('leads_page_*');  // Clear all cached pages of lead list

        return response()->json([
            'message' => 'Lead deleted successfully'
        ], 200);
    }

    /**
     * Validate the incoming request for storing or updating leads.
     */
    private function validateLead(Request $request, $leadId = null)
    {
        return $request->validate([
            'name' => 'required|string|max:191',
            'email' => 'required|email',
            'phone' => 'required|string|max:20',
            'lead_status_id' => 'required|exists:lead_statuses,id',
        ]);
    }
}
