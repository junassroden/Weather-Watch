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
        return code <= 55 ? "Drizzle" : "Rain";
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

    if (code >= 71 && code <= 77) {
        return "Snow";
    }

    if (code >= 45 && code <= 48) {
        return "Fog";
    }

    return "Variable";
}

function parseLocalDate(date) {
    const [year, month, day] = date.split("-").map(Number);

    return new Date(year, month - 1, day);
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

    const localDate = parseLocalDate(date);

    const day =
        localDate.toLocaleDateString(
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
                {localDate.toLocaleDateString(
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
                    {max === null || max === undefined
                        ? "Unavailable"
                        : `${Math.round(max)}°`}
                </strong>

                <span>
                    {min === null || min === undefined
                        ? "Unavailable"
                        : `${Math.round(min)}°`}
                </span>

            </div>

            <div className="forecast-card-rain">
                <CloudRain size={14} />

                <span>
                    {precipitation === null || precipitation === undefined
                        ? "Unavailable"
                        : `${precipitation}% rain`}
                </span>
            </div>

        </div>
    );
}