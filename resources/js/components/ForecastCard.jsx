import WeatherIllustration from "./WeatherIllustration";
import { weatherLabel } from "./WeatherVisual";

/* The one forecast tile in the app. The week strip and the hourly strip
   both render this, so a day and an hour never look like two different
   components. `label` is whatever the caller wants on top ("Mon", "Now",
   "3 PM"); everything else is optional and simply omitted when the API
   has no value for it. */
export default function ForecastCard({
    label,
    sublabel,
    weatherCode,
    isDay = true,
    temperature,
    min,
    precipitation,
    active = false,
}) {
    const condition = weatherLabel(weatherCode);

    return (
        <article
            className={`forecast-card ${active ? "is-active" : ""}`}
            aria-label={`${label}, ${condition}${
                temperature == null ? "" : `, ${Math.round(temperature)} degrees`
            }`}
        >
            <div className="forecast-card-label">
                <strong>{label}</strong>
                {sublabel && <span>{sublabel}</span>}
            </div>

            <span className="forecast-card-icon">
                <WeatherIllustration code={weatherCode} isDay={isDay} size={40} />
            </span>

            <div className="forecast-card-temp">
                <strong>
                    {temperature == null ? "--" : `${Math.round(temperature)}°`}
                </strong>

                {min != null && <span>{Math.round(min)}°</span>}
            </div>

            {precipitation != null && (
                <span className="forecast-card-rain">
                    {Math.round(precipitation)}%
                </span>
            )}
        </article>
    );
}