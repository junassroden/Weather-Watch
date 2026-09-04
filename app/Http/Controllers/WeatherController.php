<?php

namespace App\Http\Controllers;

use App\Services\WeatherService;
use Illuminate\Http\Request;

class WeatherController extends Controller
{
    public function __construct(
        private WeatherService $weatherService
    ) {
    }

    public function current(
        Request $request
    ) {
        $validated =
            $request->validate([
                'latitude' => [
                    'required',
                    'numeric',
                    'between:-90,90',
                ],

                'longitude' => [
                    'required',
                    'numeric',
                    'between:-180,180',
                ],
            ]);

        $weather =
            $this->weatherService->getCurrentWeather(
                (float) $validated['latitude'],
                (float) $validated['longitude']
            );

        return response()->json([
            'success' => true,
            'data' => $weather,
        ]);
    }
}