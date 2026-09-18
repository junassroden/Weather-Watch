import {
    Warning,
    Drop,
    ArrowClockwise,
    Thermometer,
    ThermometerCold,
    Wind,
} from "@phosphor-icons/react";
import { useEffect, useState } from "react";

import Header from "./Header";
import ForecastCard from "./ForecastCard";
import LocationSearch from "./LocationSearch";
import PrecipitationChart from "./PrecipitationChart";
import WeatherEnvironment from "./WeatherEnvironment";
import WeatherIllustration from "./WeatherIllustration";
import WeatherIcon, { getWeatherType, weatherLabel } from "./WeatherVisual";
import sunriseIcon from "../assets/weather-icons/sunrise.svg";
import sunsetIcon from "../assets/weather-icons/sunset.svg";
import humidityIcon from "../assets/weather-icons/humidity.svg";
import barometerIcon from "../assets/weather-icons/barometer.svg";
import uvIcon from "../assets/weather-icons/uv-index.svg";
import { getCurrentWeather, getForecast, reverseLocation } from "../services/api";

function formatTime(value) {
    return value
        ? new Date(value).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })
        : "--";
}

function shortDay(date) {
    const [year, month, day] = date.split("-").map(Number);
    return new Date(year, month - 1, day).toLocaleDateString("en-US", { weekday: "short" });
}

function isForecastHourDay(time, forecast) {
    const dayIndex = forecast?.daily?.time?.indexOf(time?.slice(0, 10)) ?? -1;
    const sunrise = forecast?.daily?.sunrise?.[dayIndex];
    const sunset = forecast?.daily?.sunset?.[dayIndex];

    if (!sunrise || !sunset) return true;

    const timestamp = new Date(time).getTime();
    return timestamp >= new Date(sunrise).getTime()
        && timestamp <= new Date(sunset).getTime();
}

/* UV categories follow the WHO global solar UV index scale. These are
   published thresholds applied to the real uv_index value, not invented
   ratings. */
function uvCategory(uv) {
    if (uv == null) return { label: "", tone: "neutral" };
    if (uv < 3) return { label: "Low", tone: "good" };
    if (uv < 6) return { label: "Moderate", tone: "moderate" };
    if (uv < 8) return { label: "High", tone: "high" };
    if (uv < 11) return { label: "Very High", tone: "high" };
    return { label: "Extreme", tone: "severe" };
}

/* Standard sea-level pressure is ~1013 hPa; these bands are the usual
   meteorological read of a barometer, applied to the real pressure value. */
function pressureCategory(pressure) {
    if (pressure == null) return { label: "", tone: "neutral" };
    if (pressure < 1000) return { label: "Low", tone: "moderate" };
    if (pressure > 1022) return { label: "High", tone: "good" };
    return { label: "Normal", tone: "good" };
}

function humidityCategory(humidity) {
    if (humidity == null) return { label: "", tone: "neutral" };
    if (humidity < 30) return { label: "Dry", tone: "moderate" };
    if (humidity > 70) return { label: "Humid", tone: "moderate" };
    return { label: "Comfortable", tone: "good" };
}

export default function ForecastExperience() {
    const [locationName, setLocationName] = useState("");
    const [weather, setWeather] = useState(null);
    const [forecast, setForecast] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [range, setRange] = useState("week");

    const loadWeather = async (latitude, longitude, searchedLocation = "") => {
        setLoading(true);
        setError("");

        try {
            // Every panel on this page is driven by these three responses
            // resolved together, so the temperature, the forecast strip and
            // the location label can never show a mix of old and new data.
            const [weatherData, forecastData, locationData] = await Promise.all([
                getCurrentWeather(latitude, longitude),
                getForecast(latitude, longitude),
                reverseLocation(latitude, longitude),
            ]);

            setWeather(weatherData);
            setForecast(forecastData);
            setLocationName(
                searchedLocation
                || locationData.city
                || locationData.display_name
                || "Current Location"
            );
        } catch {
            setError("Unable to retrieve weather information.");
        } finally {
            setLoading(false);
        }
    };

    const requestLocation = () => {
        if (!navigator.geolocation) {
            setError("Geolocation is not supported by this browser.");
            setLoading(false);
            return;
        }

        setLoading(true);
        navigator.geolocation.getCurrentPosition(
            ({ coords }) => loadWeather(coords.latitude, coords.longitude),
            () => {
                setError("Location permission was denied. Search for a city to continue.");
                setLoading(false);
            },
            { enableHighAccuracy: true, timeout: 10000, maximumAge: 300000 }
        );
    };

    useEffect(() => {
        requestLocation();
    }, []);

    const selectLocation = (result) =>
        loadWeather(result.latitude, result.longitude, result.name);

    const daily = forecast?.daily;
    const hourly = forecast?.hourly;
    const isDay = weather?.is_day !== 0;
    const todayHigh = daily?.temperature_2m_max?.[0];
    const todayLow = daily?.temperature_2m_min?.[0];
    const tempUnit = weather?.units?.temperature_2m || "°C";
    const uv = uvCategory(weather?.uv_index);
    const pressure = pressureCategory(weather?.pressure);
    const humidity = humidityCategory(weather?.humidity);
    const today = new Date().toLocaleDateString("en-US", { weekday: "long" });
    const weatherType = getWeatherType(weather?.weather_code);

    return (
        <div className={`weather-app weather-atmosphere-${weatherType}`}>
            <Header
                showSearch={false}
                onUseLocation={requestLocation}
                onLocationSelect={selectLocation}
            />

            <main className="page-content">
                <div className="container">
                    {error && (
                        <div className="error-panel">
                            <Warning size={18} weight="thin" />
                            <span>{error}</span>
                            <button type="button" onClick={requestLocation}>
                                <ArrowClockwise size={15} weight="thin" />
                                Retry
                            </button>
                        </div>
                    )}

                    <div className="forecast-workspace">

                        {/* LEFT — current conditions */}
                        <aside className="current-panel">
                            <LocationSearch onLocationSelect={selectLocation} />

                            <div className="current-panel-visual">
                                <WeatherEnvironment
                                    code={weather?.weather_code}
                                    isDay={isDay}
                                    className="current-panel-scene"
                                />
                                <WeatherIllustration
                                    code={weather?.weather_code}
                                    isDay={isDay}
                                    size={104}
                                    className="current-panel-illustration"
                                />
                            </div>

                            <div className="current-panel-temp">
                                {weather?.temperature == null
                                    ? "--"
                                    : Math.round(weather.temperature)}
                                <span>{tempUnit}</span>
                            </div>

                            <div className="current-panel-place">
                                <strong>{locationName || (loading ? "Locating..." : "No location")}</strong>
                                <span>{today}</span>
                            </div>

                            <ul className="current-panel-facts">
                                <li>
                                    <WeatherIcon code={weather?.weather_code} isDay={isDay} size={17} />
                                    {weather ? weatherLabel(weather.weather_code) : "Waiting for conditions"}
                                </li>
                                <li>
                                    <ThermometerCold size={17} weight="thin" />
                                    Min Temperature –{" "}
                                    {todayLow == null ? "--" : `${Math.round(todayLow)}${tempUnit}`}
                                </li>
                                <li>
                                    <Thermometer size={17} weight="thin" />
                                    Max Temperature –{" "}
                                    {todayHigh == null ? "--" : `${Math.round(todayHigh)}${tempUnit}`}
                                </li>
                            </ul>

                            <div className="current-panel-metrics">
                                <div>
                                    <Drop size={20} weight="thin" />
                                    <div>
                                        <strong>
                                            {weather?.humidity == null
                                                ? "--"
                                                : `${Math.round(weather.humidity)}%`}
                                        </strong>
                                        <span>Humidity</span>
                                    </div>
                                </div>

                                <div>
                                    <Wind size={20} weight="thin" />
                                    <div>
                                        <strong>
                                            {weather?.wind_speed == null
                                                ? "--"
                                                : `${Math.round(weather.wind_speed)}${weather?.units?.wind_speed_10m || "km/h"}`}
                                        </strong>
                                        <span>Wind Speed</span>
                                    </div>
                                </div>
                            </div>
                        </aside>

                        {/* RIGHT — forecast + overview */}
                        <section className="forecast-main">
                            <div className="range-tabs" role="tablist" aria-label="Forecast range">
                                <button
                                    type="button"
                                    role="tab"
                                    aria-selected={range === "today"}
                                    className={`range-tab ${range === "today" ? "is-active" : ""}`}
                                    onClick={() => setRange("today")}
                                >
                                    Today
                                </button>
                                <button
                                    type="button"
                                    role="tab"
                                    aria-selected={range === "week"}
                                    className={`range-tab ${range === "week" ? "is-active" : ""}`}
                                    onClick={() => setRange("week")}
                                >
                                    Week
                                </button>
                            </div>

                            <div className="forecast-strip">
                                {range === "week"
                                    ? daily?.time?.slice(0, 7).map((date, index) => (
                                        <ForecastCard
                                            key={date}
                                            label={shortDay(date)}
                                            weatherCode={daily.weather_code?.[index]}
                                            temperature={daily.temperature_2m_max?.[index]}
                                            min={daily.temperature_2m_min?.[index]}
                                            precipitation={daily.precipitation_probability_max?.[index]}
                                            active={index === 0}
                                        />
                                    ))
                                    : hourly?.time?.slice(0, 7).map((time, index) => (
                                        <ForecastCard
                                            key={time}
                                            label={
                                                index === 0
                                                    ? "Now"
                                                    : new Date(time).toLocaleTimeString([], { hour: "numeric" })
                                            }
                                            weatherCode={hourly.weather_code?.[index]}
                                            isDay={isForecastHourDay(time, forecast)}
                                            temperature={hourly.temperature_2m?.[index]}
                                            precipitation={hourly.precipitation_probability?.[index]}
                                            active={index === 0}
                                        />
                                    ))}

                                {!loading && !daily?.time?.length && !hourly?.time?.length && (
                                    <div className="strip-empty">
                                        Forecast data is unavailable for this location.
                                    </div>
                                )}

                                {loading && !forecast && (
                                    <div className="strip-empty">Loading forecast...</div>
                                )}
                            </div>

                            <h2 className="overview-title">Today&rsquo;s Overview</h2>

                            <div className="overview-layout">
                                <article className="overview-chart">
                                    <span className="stat-card-title">Precipitation, next 12 hours</span>
                                    <PrecipitationChart
                                        times={hourly?.time || []}
                                        values={hourly?.precipitation_probability || []}
                                    />
                                </article>

                                <div className="overview-metrics">
                                    <div className="overview-metric-row">
                                        <img src={uvIcon} alt="" width={22} height={22} />
                                        <div className="overview-metric-text">
                                            <span>UV Index</span>
                                            <strong>
                                                {weather?.uv_index == null ? "--" : Math.round(weather.uv_index)}
                                            </strong>
                                        </div>
                                        <span className={`overview-metric-status stat-status-${uv.tone}`}>{uv.label}</span>
                                    </div>

                                    <div className="overview-metric-row">
                                        <img src={barometerIcon} alt="" width={22} height={22} />
                                        <div className="overview-metric-text">
                                            <span>Pressure</span>
                                            <strong>
                                                {weather?.pressure == null ? "--" : Math.round(weather.pressure)}
                                                <small>{weather?.units?.pressure_msl || "hPa"}</small>
                                            </strong>
                                        </div>
                                        <span className={`overview-metric-status stat-status-${pressure.tone}`}>{pressure.label}</span>
                                    </div>

                                    <div className="overview-metric-row">
                                        <img src={humidityIcon} alt="" width={22} height={22} />
                                        <div className="overview-metric-text">
                                            <span>Humidity</span>
                                            <strong>
                                                {weather?.humidity == null ? "--" : Math.round(weather.humidity)}
                                                <small>%</small>
                                            </strong>
                                        </div>
                                        <span className={`overview-metric-status stat-status-${humidity.tone}`}>{humidity.label}</span>
                                    </div>

                                    <div className="overview-metric-row overview-metric-row-split">
                                        <div className="overview-metric-half">
                                            <img src={sunriseIcon} alt="" width={22} height={22} />
                                            <div className="overview-metric-text">
                                                <span>Sunrise</span>
                                                <strong>{formatTime(daily?.sunrise?.[0])}</strong>
                                            </div>
                                        </div>
                                        <div className="overview-metric-half">
                                            <img src={sunsetIcon} alt="" width={22} height={22} />
                                            <div className="overview-metric-text">
                                                <span>Sunset</span>
                                                <strong>{formatTime(daily?.sunset?.[0])}</strong>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>

                    </div>
                </div>
            </main>
        </div>
    );
}