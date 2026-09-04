import {
    Cloud,
    CloudRain,
    CloudSun,
    Sun,
    CloudLightning,
} from "lucide-react";

function getWeatherIcon(code) {
    if (code === 0) {
        return Sun;
    }

    if (
        code === 1 ||
        code === 2 ||
        code === 3
    ) {
        return CloudSun;
    }

    if (
        code >= 51 &&
        code <= 67
    ) {
        return CloudRain;
    }

    if (
        code >= 80 &&
        code <= 82
    ) {
        return CloudRain;
    }

    if (
        code >= 95
    ) {
        return CloudLightning;
    }

    return Cloud;
}

function getWeatherLabel(code) {
    if (code === 0) {
        return "Clear sky";
    }

    if (code === 1) {
        return "Mainly clear";
    }

    if (code === 2) {
        return "Partly cloudy";
    }

    if (code === 3) {
        return "Overcast";
    }

    if (
        code >= 51 &&
        code <= 67
    ) {
        return "Rain";
    }

    if (
        code >= 80 &&
        code <= 82
    ) {
        return "Rain showers";
    }

    if (code >= 95) {
        return "Thunderstorm";
    }

    return "Variable";
}

export default function ForecastCard({
    date,
    weatherCode,
    max,
    min,
    precipitation,
}) {
    const Icon =
        getWeatherIcon(weatherCode);

    const label =
        getWeatherLabel(weatherCode);

    const day =
        new Date(date).toLocaleDateString(
            "en-US",
            {
                weekday: "short",
            }
        );

    return (
        <div className="forecast-card">

            <div className="forecast-card-day">
                {day}
            </div>

            <div className="forecast-card-date">
                {new Date(
                    date
                ).toLocaleDateString(
                    "en-US",
                    {
                        month: "short",
                        day: "numeric",
                    }
                )}
            </div>

            <div className="forecast-card-icon">
                <Icon size={32} />
            </div>

            <div className="forecast-card-condition">
                {label}
            </div>

            <div className="forecast-card-temperatures">

                <strong>
                    {Math.round(max ?? 0)}°
                </strong>

                <span>
                    {Math.round(min ?? 0)}°
                </span>

            </div>

            <div className="forecast-card-rain">
                <CloudRain size={14} />

                <span>
                    {precipitation ?? 0}% rain
                </span>
            </div>

        </div>
    );
}