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
                'latitude' =>
                    $latitude,

                'longitude' =>
                    $longitude,
            ],

            'official_alerts' => [],

            'message' =>
                'No official weather warning source has been connected yet.',

            'source_status' =>
                'not_configured',
        ];
    }
}