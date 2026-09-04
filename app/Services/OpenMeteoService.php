<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use RuntimeException;

class OpenMeteoService
{
    private string $forecastUrl = 'https://api.open-meteo.com/v1/forecast';
    private string $geocodingUrl = 'https://geocoding-api.open-meteo.com/v1/search';

    public function forecast(float $latitude, float $longitude, array $parameters = []): array
    {
        $response = Http::timeout(15)
            ->retry(2, 500)
            ->get($this->forecastUrl, array_merge([
                'latitude' => $latitude,
                'longitude' => $longitude,
                'timezone' => 'auto',
            ], $parameters));

        if ($response->failed()) {
            throw new RuntimeException(
                'Unable to retrieve weather data from Open-Meteo.'
            );
        }

        return $response->json();
    }

    public function searchLocation(string $name): array
    {
        $response = Http::timeout(15)
            ->retry(2, 500)
            ->get($this->geocodingUrl, [
                'name' => $name,
                'count' => 10,
                'language' => 'en',
                'format' => 'json',
            ]);

        if ($response->failed()) {
            throw new RuntimeException(
                'Unable to search for the requested location.'
            );
        }

        return $response->json();
    }
}