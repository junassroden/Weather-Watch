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
        $response = Http::timeout(15)
            ->retry(2, 500)
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
