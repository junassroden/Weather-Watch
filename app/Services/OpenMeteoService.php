<?php

namespace App\Services;

use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use RuntimeException;

class OpenMeteoService
{
    private string $forecastUrl =
        'https://api.open-meteo.com/v1/forecast';

    private string $geocodingUrl =
        'https://geocoding-api.open-meteo.com/v1/search';

    /**
     * Fetch current + hourly + daily fields in a single Open-Meteo call.
     *
     * WeatherService and ForecastService both call this with the exact
     * same parameter set, so they produce the exact same cache key inside
     * forecast(). That means only ONE external HTTP request is made per
     * cache window (60s) no matter how many of /weather/current,
     * /weather/forecast and /weather/risk are requested for the same
     * coordinates - instead of two (or three) separate Open-Meteo calls.
     */
    public function bundle(
        float $latitude,
        float $longitude
    ): array {
        return $this->forecast(
            $latitude,
            $longitude,
            [
                'forecast_days' => 7,

                'temperature_unit' => 'celsius',
                'wind_speed_unit' => 'kmh',
                'precipitation_unit' => 'mm',

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
    }

    public function forecast(
        float $latitude,
        float $longitude,
        array $parameters = []
    ): array {
        $query = array_merge(
            [
                'latitude' => $latitude,
                'longitude' => $longitude,
                'timezone' => 'auto',
            ],
            $parameters
        );

        $cacheKey = 'weatherwatch.open-meteo.'.hash(
            'sha256',
            json_encode($query)
        );

        return Cache::remember(
            $cacheKey,
            60,
            function () use ($query): array {
                $response = Http::connectTimeout(3)
                    ->timeout(8)
                    ->retry(1, 250)
                    ->get($this->forecastUrl, $query);

                if ($response->failed()) {
                    throw new RuntimeException(
                        'Unable to retrieve weather data.'
                    );
                }

                return $response->json();
            }
        );
    }

    public function searchLocation(
        string $name
    ): array {
        $response = Http::connectTimeout(3)
            ->timeout(6)
            ->retry(1, 300)
            ->get(
                $this->geocodingUrl,
                [
                    'name' => $name,
                    'count' => 10,
                    'language' => 'en',
                    'format' => 'json',
                ]
            );

        if ($response->failed()) {
            throw new RuntimeException(
                'Unable to search for the requested location.'
            );
        }

        return $response->json();
    }
}