import {
    CloudRain,
} from "lucide-react";

import WeatherVisual, {
    weatherLabel,
} from "./WeatherVisual";

function parseDate(date) {
    const [
        year,
        month,
        day,
    ] = date
        .split("-")
        .map(Number);

    return new Date(
        year,
        month - 1,
        day
    );
}

export default function ForecastCard({
    date,
    weatherCode,
    max,
    min,
    precipitation,
}) {
    const parsedDate =
        parseDate(date);

    const weekday =
        parsedDate.toLocaleDateString(
            "en-US",
            {
                weekday: "long",
            }
        );

    const shortDate =
        parsedDate.toLocaleDateString(
            "en-US",
            {
                month: "short",
                day: "numeric",
            }
        );

    return (
        <article className="forecast-card">

            <div className="forecast-date">
                <strong>
                    {weekday}
                </strong>

                <span>
                    {shortDate}
                </span>
            </div>

            <div className="forecast-visual">
                <WeatherVisual
                    code={weatherCode}
                    isDay={true}
                    size="small"
                />
            </div>

            <div className="forecast-condition">
                {weatherLabel(
                    weatherCode
                )}
            </div>

            <div className="forecast-temperature">

                <strong>
                    {max == null
                        ? "—"
                        : `${Math.round(max)}°`}
                </strong>

                <span>
                    {min == null
                        ? "—"
                        : `${Math.round(min)}°`}
                </span>

            </div>

            <div className="forecast-rain">
                <CloudRain
                    size={14}
                />

                <span>
                    {precipitation == null
                        ? "—"
                        : `${Math.round(
                              precipitation
                          )}% rain`}
                </span>
            </div>

        </article>
    );
}