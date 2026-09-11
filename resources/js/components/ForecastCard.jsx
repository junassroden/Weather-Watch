import {
    CloudRain,
} from "lucide-react";

import WeatherEnvironment from "./WeatherEnvironment";
import { getWeatherType, weatherLabel } from "./WeatherVisual";

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

    const weatherType = getWeatherType(weatherCode);

    return (
        <article
            className={`forecast-card forecast-card-${weatherType}`}
            aria-label={`${weekday}, ${weatherLabel(weatherCode)}, high ${
                max == null ? "unavailable" : `${Math.round(max)} degrees`
            }, low ${min == null ? "unavailable" : `${Math.round(min)} degrees`}`}
        >

            <WeatherEnvironment
                code={weatherCode}
                isDay={true}
                className="forecast-scene"
            />

            <div className="forecast-card-scrim" aria-hidden="true" />

            <div className="forecast-card-top">
                <div className="forecast-date glass-chip">
                    <strong>
                        {weekday}
                    </strong>

                    <span>
                        {shortDate}
                    </span>
                </div>
            </div>

            <div className="forecast-card-bottom glass-panel-frost">

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
                        size={13}
                    />

                    <span>
                        {precipitation == null
                            ? "—"
                            : `${Math.round(
                                  precipitation
                              )}% rain`}
                    </span>
                </div>

            </div>

        </article>
    );
}