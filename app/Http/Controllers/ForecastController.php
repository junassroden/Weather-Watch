<?php

namespace App\Http\Controllers;

use App\Services\ForecastService;
use Illuminate\Http\Request;

class ForecastController extends Controller
{
    public function __construct(
        private ForecastService $forecastService
    ) {
    }

    public function index(Request $request)
    {
        $validated = $request->validate([
            'latitude' => ['required', 'numeric', 'between:-90,90'],
            'longitude' => ['required', 'numeric', 'between:-180,180'],
        ]);

        $forecast = $this->forecastService->getForecast(
            (float) $validated['latitude'],
            (float) $validated['longitude']
        );

        return response()->json([
            'success' => true,
            'data' => $forecast,
        ]);
    }
}