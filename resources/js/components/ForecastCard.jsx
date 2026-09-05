import { CloudRain } from "lucide-react";

import WeatherVisual, {
    getWeatherLabel,
} from "./WeatherVisual";

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

            <WeatherVisual
                weatherCode={weatherCode}
                isDay={true}
                size="small"
            />

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