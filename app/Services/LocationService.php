<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use RuntimeException;

class LocationService
{
    public function __construct(
        private OpenMeteoService $openMeteo
    ) {
    }

    public function search(
        string $query
    ): array {
        $data =
            $this->openMeteo->searchLocation(
                $query
            );

        return collect(
            $data['results'] ?? []
        )
            ->map(function ($location) {
                return [
                    'name' =>
                        $location['name'] ?? null,

                    'latitude' =>
                        $location['latitude'] ?? null,

                    'longitude' =>
                        $location['longitude'] ?? null,

                    'country' =>
                        $location['country'] ?? null,

                    'country_code' =>
                        $location['country_code'] ?? null,

                    'admin1' =>
                        $location['admin1'] ?? null,

                    'timezone' =>
                        $location['timezone'] ?? null,
                ];
            })
            ->values()
            ->all();
    }

    public function reverse(
        float $latitude,
        float $longitude
    ): array {
        $response =
            Http::timeout(15)
                ->retry(2, 500)
                ->withHeaders([
                    'User-Agent' =>
                        'WeatherWatch Educational Weather Project',
                ])
                ->get(
                    'https://nominatim.openstreetmap.org/reverse',
                    [
                        'lat' => $latitude,
                        'lon' => $longitude,
                        'format' => 'jsonv2',
                        'zoom' => 10,
                    ]
                );

        if ($response->failed()) {
            throw new RuntimeException(
                'Unable to identify the current location.'
            );
        }

        $data =
            $response->json();

        $address =
            $data['address'] ?? [];

        return [
            'latitude' =>
                $latitude,

            'longitude' =>
                $longitude,

            'display_name' =>
                $data['display_name'] ?? null,

            'city' =>
                $address['city']
                ?? $address['town']
                ?? $address['municipality']
                ?? $address['village']
                ?? null,

            'province' =>
                $address['state'] ?? null,

            'country' =>
                $address['country'] ?? null,

            'country_code' =>
                $address['country_code'] ?? null,
        ];
    }
}