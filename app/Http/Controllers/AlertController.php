<?php

namespace App\Http\Controllers;

use App\Services\AlertService;
use Illuminate\Http\Request;

class AlertController extends Controller
{
    public function __construct(
        private AlertService $alertService
    ) {
    }

    public function index(
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
                $this->alertService
                    ->getAlerts(
                        (float) $validated['latitude'],
                        (float) $validated['longitude']
                    ),
        ]);
    }
}