<?php

namespace App\Services;

class WeatherService
{
    public function __construct(
        private OpenMeteoService $openMeteo
    ) {}

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
                    'precipitation_probability',
                    'weather_code',
                    'cloud_cover',
                    'pressure_msl',
                    'wind_speed_10m',
                    'wind_direction_10m',
                    'wind_gusts_10m',
                    'visibility',
                    'uv_index',
                    'dew_point_2m',
                    'is_day',
                ]),
                'temperature_unit' => 'celsius',
                'wind_speed_unit' => 'kmh',
                'precipitation_unit' => 'mm',
            ]
        );

        $current =
            $data['current'] ?? [];

        return [
            'location' => [
                'latitude' => $latitude,
                'longitude' => $longitude,
                'timezone' => $data['timezone'] ?? null,
                'timezone_abbreviation' => $data['timezone_abbreviation'] ?? null,
            ],

            'updated_at' => $current['time'] ?? null,

            'temperature' => $current['temperature_2m'] ?? null,

            'feels_like' => $current['apparent_temperature'] ?? null,

            'humidity' => $current['relative_humidity_2m'] ?? null,

            'precipitation' => $current['precipitation'] ?? null,

            'rain' => $current['rain'] ?? null,

            'showers' => $current['showers'] ?? null,

            'precipitation_probability' => $current['precipitation_probability'] ?? null,

            'weather_code' => $current['weather_code'] ?? null,

            'cloud_cover' => $current['cloud_cover'] ?? null,

            'pressure' => $current['pressure_msl'] ?? null,

            'wind_speed' => $current['wind_speed_10m'] ?? null,

            'wind_direction' => $current['wind_direction_10m'] ?? null,

            'wind_gust' => $current['wind_gusts_10m'] ?? null,

            'visibility' => $current['visibility'] ?? null,

            'is_day' => $current['is_day'] ?? null,

            'uv_index' => $current['uv_index'] ?? null,

            'dew_point' => $current['dew_point_2m'] ?? null,

            'units' => $data['current_units'] ?? [],
        ];
    }
}
