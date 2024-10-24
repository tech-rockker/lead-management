<?php

use App\Http\Controllers\LeadController;
use Illuminate\Support\Facades\Route;

Route::prefix('leads')->group(function () {
    Route::get('/', [LeadController::class, 'index'])->name('leads.index');
    Route::post('/', [LeadController::class, 'store'])->name('leads.store');
    Route::get('/search', [LeadController::class, 'search'])->name('leads.search');
    Route::put('/{lead}', [LeadController::class, 'update'])->name('leads.update');
    Route::delete('/{lead}', [LeadController::class, 'destroy'])->name('leads.destroy');
});

Route::get('statuses', function () {
    return response()->json(\App\Models\LeadStatus::all());
})->name('statuses.index');
