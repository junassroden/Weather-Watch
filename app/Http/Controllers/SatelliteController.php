<?php

namespace App\Http\Controllers;

use App\Services\SatelliteService;

class SatelliteController extends Controller
{
    public function __construct(
        private SatelliteService $satelliteService
    ) {
    }

    public function frames()
    {
        return response()->json([
            'success' => true,
            'data' => $this->satelliteService->getRadarFrames(),
        ]);
    }
}