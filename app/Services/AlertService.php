<?php

namespace App\Services;

class AlertService
{
    public function getAlerts(
        float $latitude,
        float $longitude
    ): array {
        return [
            'location' => [
                'latitude' => $latitude,

                'longitude' => $longitude,
            ],

            'official_alerts' => [],

            'message' => 'No official weather warning source is currently connected.',

            'source_status' => 'not_configured',
        ];
    }
}
