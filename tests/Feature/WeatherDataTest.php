<?php

namespace Tests\Feature;

use Illuminate\Http\Client\Request;
use Illuminate\Support\Facades\Http;
use Tests\TestCase;

class WeatherDataTest extends TestCase
{
    public function test_it_does_not_report_drizzle_when_the_current_model_reports_no_precipitation(): void
    {
        Http::preventStrayRequests();
        Http::fake([
            'api.open-meteo.com/v1/forecast*' => Http::response([
                'current' => [
                    'time' => '2026-10-04T11:15',
                    'weather_code' => 51,
                    'precipitation' => 0,
                    'rain' => 0,
                    'showers' => 0,
                    'cloud_cover' => 42,
                ],
            ]),
        ]);

        $response = $this->getJson('/api/weather/current?latitude=13.4108&longitude=121.1803');

        $response
            ->assertOk()
            ->assertJsonPath('data.weather_code', 2)
            ->assertJsonPath('data.weather_code_model', 51)
            ->assertJsonPath(
                'data.condition_note',
                'No precipitation is indicated at the latest update; condition is based on cloud cover.'
            );

        Http::assertSentCount(1);
    }

    public function test_it_keeps_a_precipitation_condition_when_current_precipitation_is_present(): void
    {
        Http::preventStrayRequests();
        Http::fake([
            'api.open-meteo.com/v1/forecast*' => Http::response([
                'current' => [
                    'time' => '2026-10-04T11:15',
                    'weather_code' => 51,
                    'precipitation' => 0.2,
                    'rain' => 0.2,
                    'showers' => 0,
                    'cloud_cover' => 42,
                ],
            ]),
        ]);

        $response = $this->getJson('/api/weather/current?latitude=12.3456&longitude=78.9012');

        $response
            ->assertOk()
            ->assertJsonPath('data.weather_code', 51)
            ->assertJsonPath('data.weather_code_model', 51)
            ->assertJsonPath('data.condition_note', null);
    }

    public function test_it_reports_cloud_cover_instead_of_trace_modelled_drizzle(): void
    {
        Http::preventStrayRequests();
        Http::fake([
            'api.open-meteo.com/v1/forecast*' => Http::response([
                'current' => [
                    'time' => '2026-10-04T11:15',
                    'weather_code' => 51,
                    'precipitation' => 0.1,
                    'rain' => 0.1,
                    'showers' => 0,
                    'cloud_cover' => 44,
                ],
            ]),
        ]);

        $response = $this->getJson('/api/weather/current?latitude=9.8765&longitude=43.2109');

        $response
            ->assertOk()
            ->assertJsonPath('data.weather_code', 2)
            ->assertJsonPath('data.weather_code_model', 51)
            ->assertJsonPath(
                'data.condition_note',
                'The model indicates only trace precipitation (0.10 mm); local conditions may differ.'
            );
    }

    public function test_radar_frames_are_served_with_renderable_rainviewer_tile_urls(): void
    {
        Http::preventStrayRequests();
        Http::fake([
            'api.rainviewer.com/public/weather-maps.json' => Http::response([
                'host' => 'https://tilecache.rainviewer.com',
                'radar' => [
                    'past' => [
                        [
                            'time' => 1791084000,
                            'path' => '/v2/radar/1791084000',
                        ],
                    ],
                ],
            ]),
        ]);

        $response = $this->getJson('/api/satellite/frames');

        $response
            ->assertOk()
            ->assertJsonPath('data.provider', 'RainViewer')
            ->assertJsonPath(
                'data.frames.0.tile_url',
                'https://tilecache.rainviewer.com/v2/radar/1791084000/256/{z}/{x}/{y}/2/1_0.png'
            );

        Http::assertSent(fn (Request $request): bool => str_contains(
            $request->url(),
            'api.rainviewer.com/public/weather-maps.json'
        ));
    }
}
