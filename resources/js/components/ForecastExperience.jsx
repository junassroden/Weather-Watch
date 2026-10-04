import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

import AppHeader from "./AppHeader";
import { weatherLabel } from "./WeatherVisual";
import { getAlerts, getCurrentWeather, getForecast, getRisk, reverseLocation } from "../services/api";

function formatTime(value) {
    const match = value?.match(/T?(\d{2}):(\d{2})/);
    if (!match) return "--";
    const date = new Date();
    date.setHours(Number(match[1]), Number(match[2]), 0, 0);
    return date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}

function shortDay(date) {
    const [year, month, day] = date.split("-").map(Number);
    return new Date(year, month - 1, day).toLocaleDateString("en-US", { weekday: "short" });
}

function windDirectionLabel(degrees) {
    if (degrees == null) return "";
    const directions = [
        "north", "north-northeast", "northeast", "east-northeast",
        "east", "east-southeast", "southeast", "south-southeast",
        "south", "south-southwest", "southwest", "west-southwest",
        "west", "west-northwest", "northwest", "north-northwest",
    ];
    return directions[Math.round((((degrees % 360) + 360) % 360) / 22.5) % directions.length];
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

export default function ForecastExperience({ view = "current" }) {
    const [locationName, setLocationName] = useState("");
    const [locationDetail, setLocationDetail] = useState("");
    const [weather, setWeather] = useState(null);
    const [forecast, setForecast] = useState(null);
    const [risk, setRisk] = useState(null);
    const [alerts, setAlerts] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const activeRequestRef = useRef(null);
    const requestIdRef = useRef(0);

    const loadWeather = async (latitude, longitude, searchedLocation = "", searchedDetail = "") => {
        activeRequestRef.current?.abort();
        const controller = new AbortController();
        activeRequestRef.current = controller;
        const requestId = ++requestIdRef.current;
        setLoading(true);
        setError("");
        if (searchedLocation) {
            setLocationName(searchedLocation);
            setLocationDetail(searchedDetail);
        }

        const results = await Promise.allSettled([
            getCurrentWeather(latitude, longitude, { signal: controller.signal }),
            getForecast(latitude, longitude, { signal: controller.signal }),
            reverseLocation(latitude, longitude, { signal: controller.signal }),
            getRisk(latitude, longitude, { signal: controller.signal }),
            getAlerts(latitude, longitude, { signal: controller.signal }),
        ]);

        if (requestId !== requestIdRef.current) return;

        const [weatherResult, forecastResult, locationResult, riskResult, alertsResult] = results;

        if (weatherResult.status === "fulfilled") {
            setWeather(weatherResult.value);
        } else {
            setError("Current weather could not be loaded. Check your connection and try again.");
        }

        if (forecastResult.status === "fulfilled") {
            setForecast(forecastResult.value);
        } else {
            setForecast(null);
        }

        if (locationResult.status === "fulfilled") {
            const location = locationResult.value;
            setLocationName(searchedLocation || location.city || location.locality || "Current location");
            setLocationDetail(searchedDetail || [location.province, location.country].filter(Boolean).join(", "));
        } else if (searchedLocation) {
            setLocationName(searchedLocation);
            setLocationDetail("");
        }

        setRisk(riskResult.status === "fulfilled" ? riskResult.value : null);
        setAlerts(alertsResult.status === "fulfilled" ? alertsResult.value : null);
        if (results.every((result) => result.status === "rejected")) {
            setError("Unable to retrieve weather information.");
        }
        setLoading(false);
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
        return () => activeRequestRef.current?.abort();
    }, []);

    const selectLocation = (result) => loadWeather(
        result.latitude,
        result.longitude,
        result.name,
        [result.admin1, result.country].filter(Boolean).join(", ")
    );

    const daily = forecast?.daily;
    const hourly = forecast?.hourly;
    const isDay = weather?.is_day !== 0;
    const tempUnit = weather?.units?.temperature_2m || "°C";
    const uv = uvCategory(weather?.uv_index);
    const todayDate = weather?.updated_at?.slice(0, 10) || new Date().toISOString().slice(0, 10);
    const todayIndex = Math.max(daily?.time?.indexOf(todayDate) ?? -1, 0);
    const currentHour = weather?.updated_at?.slice(0, 13);
    const currentHourIndex = Math.max(hourly?.time?.findIndex((time) => time.slice(0, 13) === currentHour) ?? -1, 0);
    const hourlyTimes = hourly?.time?.slice(currentHourIndex, currentHourIndex + 12) || [];
    const dailyTimes = daily?.time?.slice(todayIndex, todayIndex + 7) || [];
    const tempHigh = daily?.temperature_2m_max?.[todayIndex];
    const tempLow = daily?.temperature_2m_min?.[todayIndex];
    const futureHourIndex = currentHourIndex + 1;
    const rainChances = hourly?.precipitation_probability?.slice(futureHourIndex, futureHourIndex + 12) || [];
    const hasRainForecast = rainChances.some((value) => value != null);
    const maxRainChance = hasRainForecast ? rainChances.reduce((maximum, value) => Math.max(maximum, value ?? 0), 0) : null;
    const nextRainIndex = hourly?.precipitation_probability
        ?.slice(currentHourIndex, currentHourIndex + 12)
        .findIndex((value) => value > 0) ?? -1;
    const locationTime = weather?.location?.timezone
        ? new Intl.DateTimeFormat([], { hour: "numeric", minute: "2-digit", timeZone: weather.location.timezone }).format(new Date())
        : null;
    const updatedTime = weather?.updated_at
        ? formatTime(weather.updated_at)
        : null;
    const todaySunrise = daily?.sunrise?.[todayIndex];
    const todaySunset = daily?.sunset?.[todayIndex];
    const officialAlerts = alerts?.official_alerts || [];

    return (
        <div className="ww-app-shell">
            <AppHeader
                onUseLocation={requestLocation}
                onLocationSelect={selectLocation}
            />

            <main className="ww-main ww-forecast-page">
                <section className="ww-forecast-intro">
                    <div>
                        <span className="ww-eyebrow">CURRENT / {locationName || (loading ? "FINDING LOCATION" : "CHOOSE LOCATION")}</span>
                        <h1>{locationName || (loading ? "Finding your location" : "Choose a location")}</h1>
                        {locationDetail && <p>{locationDetail}</p>}
                        {locationTime && <p>{locationTime}</p>}
                        <p>{updatedTime ? `Weather updated at ${updatedTime}` : loading ? "Getting local weather" : "Update time unavailable"}</p>
                    </div>
                    <div className="ww-forecast-scene">
                        <div className="ww-scene ww-scene--clear">
                            <div className="ww-scene-sky" />
                        </div>
                    </div>
                </section>

                {error && (
                    <div className="ww-inline-alert" role="alert">
                        <span>{error}</span>
                        <button type="button" onClick={requestLocation}>Retry</button>
                    </div>
                )}

                <section className="ww-forecast-detail">
                    <div className="ww-forecast-title">
                        <span className="ww-eyebrow">CURRENT WEATHER</span>
                        <h2>{weather?.temperature == null ? "--" : `${Math.round(weather.temperature)}${tempUnit}`}</h2>
                        <p>{weather ? weatherLabel(weather.weather_code) : loading ? "Waiting for local conditions" : "Weather unavailable"} · Feels like {weather?.feels_like == null ? "--" : `${Math.round(weather.feels_like)}${tempUnit}`}</p>
                    </div>

                    <div className="ww-forecast-facts">
                        <div><span>High</span><strong>{tempHigh == null ? "--" : `${Math.round(tempHigh)}${tempUnit}`}</strong></div>
                        <div><span>Low</span><strong>{tempLow == null ? "--" : `${Math.round(tempLow)}${tempUnit}`}</strong></div>
                        <div><span>Humidity</span><strong>{weather?.humidity == null ? "Unavailable" : `${Math.round(weather.humidity)}%`}</strong></div>
                        <div><span>Wind</span><strong>{weather?.wind_speed == null ? "Unavailable" : `${Math.round(weather.wind_speed)} ${weather?.units?.wind_speed_10m || "km/h"}`}</strong></div>
                    </div>
                </section>

                <section className="ww-forecast-detail">
                    <div className="ww-forecast-title">
                        <span className="ww-eyebrow">NEXT 12 HOURS</span>
                        <h2>Rain outlook</h2>
                    </div>
                    {hourlyTimes.length ? (
                        <ul>
                            {hourlyTimes.map((time, index) => {
                                const hourIndex = currentHourIndex + index;
                                const chance = hourly.precipitation_probability?.[hourIndex];
                                return (
                                    <li key={time}>
                                        {index === 0 ? "Now" : formatTime(time)}: {hourly.temperature_2m?.[hourIndex] == null ? "--" : `${Math.round(hourly.temperature_2m[hourIndex])}°`} / rain {chance == null ? "--" : `${Math.round(chance)}%`}
                                    </li>
                                );
                            })}
                        </ul>
                    ) : <p>{loading ? "Loading hourly forecast…" : "Hourly forecast is unavailable for this location."}</p>}
                    <p>{maxRainChance == null ? "--" : `${Math.round(maxRainChance)}%`}</p>
                    <p>{maxRainChance == null
                        ? "Rain probability is unavailable."
                        : maxRainChance === 0
                            ? "No rain is expected in the next 12 hours."
                            : `Highest chance ${nextRainIndex >= 0 ? `around ${formatTime(hourly?.time?.[futureHourIndex + nextRainIndex])}` : "in the next 12 hours"}.`}</p>
                </section>

                <section className="ww-forecast-detail">
                    <div className="ww-forecast-title">
                        <span className="ww-eyebrow">DETAILS</span>
                        <h2>Weather details</h2>
                    </div>
                    <ul>
                        <li>Air pressure: {weather?.pressure == null ? "Unavailable" : `${Math.round(weather.pressure)} ${weather?.units?.pressure_msl || "hPa"}`}</li>
                        <li>Visibility: {weather?.visibility == null ? "Unavailable" : `${(weather.visibility / 1000).toFixed(1)} km`}</li>
                        <li>UV Index: {weather?.uv_index == null ? "Unavailable" : Math.round(weather.uv_index)}{uv.label ? ` (${uv.label})` : ""}</li>
                        <li>Precipitation: {weather?.precipitation == null ? "Unavailable" : `${weather.precipitation} ${weather?.units?.precipitation || "mm"}`}</li>
                        <li>Sunrise: {formatTime(todaySunrise)}</li>
                        <li>Sunset: {formatTime(todaySunset)}</li>
                    </ul>
                </section>

                <section className="ww-forecast-detail">
                    <div className="ww-forecast-title">
                        <span className="ww-eyebrow">NOTICES</span>
                        <h2>Alerts</h2>
                    </div>
                    <p>{officialAlerts.length ? officialAlerts[0].title || "Warning for this location" : alerts?.message || "Official warning source is not connected."}</p>
                    {officialAlerts.length > 0 && <p>{officialAlerts[0].description || officialAlerts[0].message || "See the full alert details for guidance."}</p>}
                    <p>{risk?.level || "Assessment unavailable"}</p>
                    <Link to="/satellite-radar">Open weather map</Link>
                </section>
            </main>
        </div>
    );
}