<?php

namespace App\Services;

class WeatherService
{
    private const TRACE_PRECIPITATION_THRESHOLD = 0.1;

    public function __construct(
        private OpenMeteoService $openMeteo
    ) {}

    public function getCurrentWeather(
        float $latitude,
        float $longitude
    ): array {
        $data = $this->openMeteo->bundle(
            $latitude,
            $longitude
        );

        $current =
            $data['current'] ?? [];

        $modelWeatherCode = $current['weather_code'] ?? null;
        $weatherCode = $modelWeatherCode;
        $conditionNote = null;
        $precipitationReadings = array_filter(
            [
                $current['precipitation'] ?? null,
                $current['rain'] ?? null,
                $current['showers'] ?? null,
            ],
            fn ($reading) => is_numeric($reading)
        );

        $maximumPrecipitation = $precipitationReadings === []
            ? null
            : max(array_map(
                fn ($reading) => (float) $reading,
                $precipitationReadings
            ));

        if (
            $this->isPrecipitationCode($modelWeatherCode)
            && $maximumPrecipitation !== null
            && $maximumPrecipitation <= self::TRACE_PRECIPITATION_THRESHOLD
            && is_numeric($current['cloud_cover'] ?? null)
        ) {
            $cloudCover = (float) $current['cloud_cover'];
            $weatherCode = match (true) {
                $cloudCover <= 10 => 0,
                $cloudCover <= 30 => 1,
                $cloudCover <= 75 => 2,
                default => 3,
            };
            $conditionNote = $maximumPrecipitation > 0
                ? sprintf(
                    'The model indicates only trace precipitation (%.2f mm); local conditions may differ.',
                    $maximumPrecipitation
                )
                : 'No precipitation is indicated at the latest update; condition is based on cloud cover.';
        }

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

            'weather_code' => $weatherCode,

            'weather_code_model' => $modelWeatherCode,

            'condition_note' => $conditionNote,

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

    private function isPrecipitationCode(mixed $weatherCode): bool
    {
        if (! is_numeric($weatherCode)) {
            return false;
        }

        $weatherCode = (int) $weatherCode;

        return ($weatherCode >= 51 && $weatherCode <= 67)
            || ($weatherCode >= 71 && $weatherCode <= 77)
            || ($weatherCode >= 80 && $weatherCode <= 82)
            || ($weatherCode >= 95 && $weatherCode <= 99);
    }
}