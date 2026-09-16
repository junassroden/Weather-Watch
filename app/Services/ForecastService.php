<?php

namespace App\Services;

class ForecastService
{
    public function __construct(
        private OpenMeteoService $openMeteo
    ) {}

    public function getForecast(
        float $latitude,
        float $longitude
    ): array {
        $data =
            $this->openMeteo->bundle(
                $latitude,
                $longitude
            );

        return [
            'timezone' => $data['timezone'] ?? null,

            'timezone_abbreviation' => $data['timezone_abbreviation'] ?? null,

            'daily' => $data['daily'] ?? [],

            'daily_units' => $data['daily_units'] ?? [],

            'hourly' => $data['hourly'] ?? [],

            'hourly_units' => $data['hourly_units'] ?? [],
        ];
    }
}