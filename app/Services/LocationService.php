<?php

namespace App\Services;

use Illuminate\Support\Facades\Cache;
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
        // Reverse-geocoded addresses for the same spot don't change, so a
        // short cache avoids re-hitting Nominatim every time the user (or
        // a retried request) lands on the same coordinates. Rounding to 4
        // decimal places (~11m) still keeps the cache accurate for a
        // "current location" use case.
        $cacheKey = sprintf(
            'weatherwatch.reverse-geocode.%s.%s',
            round($latitude, 4),
            round($longitude, 4)
        );

        return Cache::remember(
            $cacheKey,
            600,
            fn (): array => $this->fetchReverse($latitude, $longitude)
        );
    }

    private function fetchReverse(
        float $latitude,
        float $longitude
    ): array {
        $response =
            Http::connectTimeout(3)
                ->timeout(6)
                ->retry(1, 300)
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
                        'addressdetails' => 1,
                        // Nominatim's `zoom` controls how coarse the
                        // resolved address is (10 = city level only,
                        // which drops suburb/village/barangay detail and
                        // can resolve to the nearest large municipality
                        // instead of the caller's actual locality). 18
                        // requests street-level detail; the address
                        // fields below then cascade back down from the
                        // most specific component that Nominatim
                        // actually returned, so we still degrade
                        // gracefully instead of inventing anything.
                        'zoom' => 18,
                    ]
                );

        if ($response->failed()) {
            throw new RuntimeException(
                'Unable to identify the current location.'
            );
        }

        $data =
            $response->json();

        // Nominatim can return HTTP 200 with an `error` payload (e.g. for
        // coordinates over open water or outside its coverage).
        if (! is_array($data) || isset($data['error'])) {
            throw new RuntimeException(
                'Unable to identify the current location.'
            );
        }

        $address =
            $data['address'] ?? [];

        return [
            'latitude' =>
                $latitude,

            'longitude' =>
                $longitude,

            'display_name' =>
                $data['display_name'] ?? null,

            // Barangay/neighbourhood-level locality first, then falls
            // back to progressively broader localities. Only fields
            // Nominatim actually returned are used - nothing here is
            // invented.
            'locality' =>
                $address['village']
                ?? $address['suburb']
                ?? $address['neighbourhood']
                ?? $address['quarter']
                ?? $address['hamlet']
                ?? null,

            'city' =>
                $address['city']
                ?? $address['town']
                ?? $address['municipality']
                ?? $address['county']
                ?? null,

            'province' =>
                $address['state']
                ?? $address['region']
                ?? null,

            'country' =>
                $address['country'] ?? null,

            'country_code' =>
                $address['country_code'] ?? null,
        ];
    }
}