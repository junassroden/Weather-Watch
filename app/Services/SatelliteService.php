<?php

namespace App\Services;

use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use RuntimeException;

class SatelliteService
{
    private string $rainViewerUrl =
        'https://api.rainviewer.com/public/weather-maps.json';

    public function getRadarFrames(): array
    {
        $cacheKey = 'weatherwatch.radar-frames';

        $cached = Cache::get($cacheKey);
        if (is_array($cached) && ! empty($cached)) {
            return $cached;
        }

        try {
            $data = $this->fetchRadarFrames();
            Cache::put($cacheKey, $data, 120);

            return $data;
        } catch (\Throwable $exception) {
            Log::warning('RainViewer radar request failed.', [
                'exception' => $exception,
            ]);

            return $this->fallbackRadarFrames();
        }
    }

    private function fetchRadarFrames(): array
    {
        $response = Http::connectTimeout(3)
            ->timeout(8)
            ->retry(1, 250)
            ->get($this->rainViewerUrl);

        if ($response->failed()) {
            throw new RuntimeException(
                'Unable to retrieve radar data from RainViewer.'
            );
        }

        $data =
            $response->json();

        $host =
            $data['host'] ?? null;

        $frames =
            $data['radar']['past'] ?? [];

        $cloudFrames = collect(
            $data['satellite']['infrared'] ?? []
        )
            ->filter(
                fn ($frame) => isset(
                    $frame['time'],
                    $frame['path']
                )
            )
            ->sortBy('time')
            ->values();

        if (! $host) {
            throw new RuntimeException(
                'RainViewer did not return a radar host.'
            );
        }

        return [
            'provider' => 'RainViewer',

            'data_type' => 'Precipitation Radar',

            'host' => $host,

            'frames' => collect($frames)
                ->filter(
                    fn ($frame) => isset(
                        $frame['time'],
                        $frame['path']
                    )
                )
                ->sortBy('time')
                ->map(
                    function ($frame) use (
                        $host
                    ) {
                        return [
                            'time' => $frame['time'],

                            'path' => $frame['path'],

                            'tile_url' => $host.
                                $frame['path'].
                                '/256/{z}/{x}/{y}/2/1_0.png',
                        ];
                    }
                )
                ->values()
                ->all(),

            'cloud_imagery' => [
                'available' => $cloudFrames->isNotEmpty(),

                'frames' => $cloudFrames
                    ->map(
                        function ($frame) use (
                            $host
                        ) {
                            return [
                                'time' => $frame['time'],

                                'path' => $frame['path'],

                                'tile_url' => $host.
                                    $frame['path'].
                                    '/256/{z}/{x}/{y}/0/0_0.png',
                            ];
                        }
                    )
                    ->values()
                    ->all(),

                'message' => $cloudFrames->isNotEmpty()
                    ? null
                    : 'Cloud imagery unavailable.',
            ],

            'attribution' => 'Radar data by RainViewer',
        ];
    }

    private function fallbackRadarFrames(): array
    {
        return [
            'provider' => 'RainViewer',
            'data_type' => 'Precipitation Radar',
            'host' => null,
            'frames' => [],
            'cloud_imagery' => [
                'available' => false,
                'frames' => [],
                'message' => 'Radar data is temporarily unavailable. Please try again shortly.',
            ],
            'attribution' => 'Radar data by RainViewer',
        ];
    }
}
