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
            $this->openMeteo->forecast(
                $latitude,
                $longitude,
                [
                    'forecast_days' => 7,

                    'hourly' => implode(',', [
                        'temperature_2m',
                        'relative_humidity_2m',
                        'apparent_temperature',
                        'precipitation_probability',
                        'precipitation',
                        'rain',
                        'weather_code',
                        'cloud_cover',
                        'visibility',
                        'wind_speed_10m',
                        'wind_gusts_10m',
                        'uv_index',
                    ]),

                    'daily' => implode(',', [
                        'weather_code',
                        'temperature_2m_max',
                        'temperature_2m_min',
                        'apparent_temperature_max',
                        'apparent_temperature_min',
                        'sunrise',
                        'sunset',
                        'precipitation_sum',
                        'rain_sum',
                        'precipitation_probability_max',
                        'wind_speed_10m_max',
                        'wind_gusts_10m_max',
                        'uv_index_max',
                    ]),
                ]
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
