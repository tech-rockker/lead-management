<?php

namespace App\Http\Controllers;

use App\Models\Lead;
use Illuminate\Http\Request;

class LeadController extends Controller
{
    public function index(Request $request)
    {
        // Get the 'per_page' value from the request, defaulting to 20 if not provided
        $perPage = 10;
        // If 'per_page' is provided, use it with a minimum of 1 and a maximum of 100
        if ($request->input('per_page')) {
            $perPage = min(max((int) $request->input('per_page', 20), 1), 100);
        }

        return Lead::with('status')->Paginate($perPage);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:191',
            'email' => 'required|email|unique:leads,email',
            'phone' => 'required|string',
            'lead_status_id' => 'required|exists:lead_statuses,id'
        ]);
        Lead::create($validated);
        return response()->json(['message' => 'Lead created successfully'], 201);
    }

    public function update(Request $request, Lead $lead)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:191',
            'email' => 'required|email|unique:leads,email,' . $lead->id,
            'phone' => 'required|string',
            'lead_status_id' => 'required|exists:lead_statuses,id'
        ]);

        $lead->update($validated);

        // Return the updated lead with status
        return response()->json(['message' => 'Lead updated successfully', 'lead' => $lead->load('status')]);
    }


    public function destroy(Lead $lead)
    {
        $lead->delete();
        return response()->json(['message' => 'Lead deleted successfully']);
    }
}
