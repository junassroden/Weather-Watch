<?php

namespace App\Services;

class RiskAssessmentService
{
    public function assess(
        array $weather,
        array $forecast = []
    ): array {
        $score = 0;

        $reasons = [];

        $rainProbability =
            $forecast[
                'daily'
            ][
                'precipitation_probability_max'
            ][0] ?? 0;

        $precipitation =
            $forecast[
                'daily'
            ][
                'precipitation_sum'
            ][0] ?? 0;

        $wind =
            $weather['wind_speed'] ?? 0;

        $gust =
            $weather['wind_gust'] ?? 0;

        $visibility =
            $weather['visibility'] ?? 10000;

        $temperature =
            $weather['temperature'] ?? 25;

        if ($rainProbability >= 70) {

            $score += 2;

            $reasons[] =
                'High probability of precipitation.';

        } elseif ($rainProbability >= 40) {

            $score += 1;

            $reasons[] =
                'Moderate probability of precipitation.';
        }

        if ($precipitation >= 30) {

            $score += 3;

            $reasons[] =
                'Heavy precipitation is possible.';

        } elseif ($precipitation >= 10) {

            $score += 2;

            $reasons[] =
                'Significant precipitation is possible.';
        }

        if (
            $wind >= 60 ||
            $gust >= 80
        ) {

            $score += 4;

            $reasons[] =
                'Very strong winds or gusts detected.';

        } elseif (
            $wind >= 40 ||
            $gust >= 60
        ) {

            $score += 2;

            $reasons[] =
                'Strong winds or gusts detected.';
        }

        if ($visibility < 1000) {

            $score += 3;

            $reasons[] =
                'Very low visibility.';

        } elseif ($visibility < 5000) {

            $score += 1;

            $reasons[] =
                'Reduced visibility.';
        }

        if ($temperature >= 38) {

            $score += 3;

            $reasons[] =
                'Very high temperature.';

        } elseif ($temperature <= 10) {

            $score += 2;

            $reasons[] =
                'Very low temperature.';
        }

        if ($score >= 8) {

            $level = 'SEVERE';

        } elseif ($score >= 5) {

            $level = 'HIGH';

        } elseif ($score >= 3) {

            $level = 'MODERATE';

        } else {

            $level = 'LOW';
        }

        return [
            'level' =>
                $level,

            'score' =>
                $score,

            'reasons' =>
                $reasons,

            'source' =>
                'WeatherWatch Risk Assessment',

            'official_warning' =>
                false,
        ];
    }
}