<?php

use App\Http\Controllers\LeadController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::apiResource('leads', LeadController::class);
Route::get('leads/search', [LeadController::class, 'search']);

Route::get('statuses', function () {
    return response()->json(\App\Models\LeadStatus::all());
});

