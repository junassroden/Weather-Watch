<?php

namespace App\Http\Controllers;

use App\Services\LocationService;
use Illuminate\Http\Request;

class LocationController extends Controller
{
    public function __construct(
        private LocationService $locationService
    ) {
    }

    public function search(
        Request $request
    ) {
        $validated =
            $request->validate([
                'q' => [
                    'required',
                    'string',
                    'min:2',
                    'max:100',
                ],
            ]);

        return response()->json([
            'success' => true,
            'data' =>
                $this->locationService->search(
                    $validated['q']
                ),
        ]);
    }

    public function reverse(
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

        return response()->json([
            'success' => true,
            'data' =>
                $this->locationService->reverse(
                    (float) $validated['latitude'],
                    (float) $validated['longitude']
                ),
        ]);
    }
}