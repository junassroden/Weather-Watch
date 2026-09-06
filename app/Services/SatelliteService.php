<?php

namespace App\Services;

use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use RuntimeException;

class SatelliteService
{
    private string $rainViewerUrl =
        'https://api.rainviewer.com/public/weather-maps.json';

    public function getRadarFrames(): array
    {
        return Cache::remember(
            'weatherwatch.radar-frames',
            120,
            fn (): array => $this->fetchRadarFrames()
        );
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

            'attribution' => 'Radar data by RainViewer',

            'cloud_imagery' => [
                'available' => false,
                'message' => 'Cloud imagery unavailable.',
            ],
        ];
    }
}
