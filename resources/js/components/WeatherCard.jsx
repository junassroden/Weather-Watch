import WeatherEnvironment from "./WeatherEnvironment";
import WeatherIllustration from "./WeatherIllustration";
import { weatherLabel } from "./WeatherVisual";

/* The one hero weather composition in the app: the dominant temperature,
   condition, and location over the live atmospheric scene. Any page that
   needs "the big current-conditions moment" renders this instead of
   hand-rolling its own copy of the same markup — a page that also needs
   its own extra chrome around it (a search bar, a compact fact list)
   still can, by wrapping <WeatherCard /> rather than duplicating it. */
export default function WeatherCard({
    weather,
    forecast,
    locationName,
    isDay = true,
    loading = false,
}) {
    const tempUnit = weather?.units?.temperature_2m || "°C";
    const todayHigh = forecast?.daily?.temperature_2m_max?.[0];
    const todayLow = forecast?.daily?.temperature_2m_min?.[0];

    return (
        <div className="current-weather-hero">
            <WeatherEnvironment
                code={weather?.weather_code}
                isDay={isDay}
                className="hero-scene"
            />

            <div className="current-weather-copy">
                <span className="eyebrow">LIVE CONDITIONS</span>

                <div className="current-temperature">
                    {weather?.temperature == null ? "--" : Math.round(weather.temperature)}
                    <span>{tempUnit}</span>
                </div>

                <div className="current-weather-condition">
                    <WeatherIllustration code={weather?.weather_code} isDay={isDay} size={58} animated={false} />
                    <span>
                        {weather
                            ? weatherLabel(weather.weather_code)
                            : loading ? "Loading conditions…" : "Conditions unavailable"}
                    </span>
                </div>

                <div className="current-weather-feelslike">
                    Feels like {weather?.feels_like == null ? "--" : Math.round(weather.feels_like)}{weather?.units?.apparent_temperature || "°C"}
                </div>

                <div className="current-weather-summary">
                    <span>{locationName || "Current location"}</span>
                    <span aria-hidden="true">•</span>
                    <span>
                        {weather?.time
                            ? new Date(weather.time).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })
                            : new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}
                    </span>
                    {todayHigh != null && (
                        <span className="current-weather-highlow">
                            H {Math.round(todayHigh)}{tempUnit} · L {todayLow == null ? "--" : Math.round(todayLow)}{tempUnit}
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
}