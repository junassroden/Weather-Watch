<?php

namespace App\Services;

class WeatherService
{
    public function __construct(
        private OpenMeteoService $openMeteo
    ) {
    }

    public function getCurrentWeather(
        float $latitude,
        float $longitude
    ): array {
        $data = $this->openMeteo->forecast(
            $latitude,
            $longitude,
            [
                'current' => implode(',', [
                    'temperature_2m',
                    'relative_humidity_2m',
                    'apparent_temperature',
                    'precipitation',
                    'rain',
                    'showers',
                    'weather_code',
                    'cloud_cover',
                    'pressure_msl',
                    'surface_pressure',
                    'wind_speed_10m',
                    'wind_direction_10m',
                    'wind_gusts_10m',
                    'visibility',
                    'is_day',
                ]),
            ]
        );

        $current = $data['current'] ?? [];

        return [
            'location' => [
                'latitude' => $latitude,
                'longitude' => $longitude,
                'timezone' => $data['timezone'] ?? null,
            ],

            'updated_at' => $current['time'] ?? null,

            'temperature' => $current['temperature_2m'] ?? null,
            'feels_like' => $current['apparent_temperature'] ?? null,
            'humidity' => $current['relative_humidity_2m'] ?? null,

            'precipitation' => $current['precipitation'] ?? null,
            'rain' => $current['rain'] ?? null,
            'showers' => $current['showers'] ?? null,

            'weather_code' => $current['weather_code'] ?? null,

            'cloud_cover' => $current['cloud_cover'] ?? null,

            'pressure' => $current['pressure_msl']
                ?? $current['surface_pressure']
                ?? null,

            'wind_speed' => $current['wind_speed_10m'] ?? null,
            'wind_direction' => $current['wind_direction_10m'] ?? null,
            'wind_gust' => $current['wind_gusts_10m'] ?? null,

            'visibility' => $current['visibility'] ?? null,

            'is_day' => $current['is_day'] ?? null,

            'units' => $data['current_units'] ?? [],
        ];
    }
}