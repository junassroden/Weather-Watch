<?php

namespace App\Http\Controllers;

use App\Services\ForecastService;
use App\Services\RiskAssessmentService;
use App\Services\WeatherService;
use Illuminate\Http\Request;

class RiskController extends Controller
{
    public function __construct(
        private WeatherService $weatherService,
        private ForecastService $forecastService,
        private RiskAssessmentService $riskService
    ) {
    }

    public function show(Request $request)
    {
        $validated = $request->validate([
            'latitude' => ['required', 'numeric', 'between:-90,90'],
            'longitude' => ['required', 'numeric', 'between:-180,180'],
        ]);

        $latitude = (float) $validated['latitude'];
        $longitude = (float) $validated['longitude'];

        $weather = $this->weatherService->getCurrentWeather(
            $latitude,
            $longitude
        );

        $forecast = $this->forecastService->getForecast(
            $latitude,
            $longitude
        );

        $risk = $this->riskService->assess(
            $weather,
            $forecast
        );

        return response()->json([
            'success' => true,
            'data' => $risk,
        ]);
    }
}