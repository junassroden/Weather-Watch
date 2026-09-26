import {
    RotateCcw,
    TriangleAlert,
    ArrowRight,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

import Header from "./Header";
import WeatherEnvironment from "./WeatherEnvironment";
import WeatherIllustration from "./WeatherIllustration";
import { getWeatherType, weatherLabel } from "./WeatherVisual";
import sunriseIcon from "../assets/weather-icons/sunrise.svg";
import sunsetIcon from "../assets/weather-icons/sunset.svg";
import humidityIcon from "../assets/weather-icons/humidity.svg";
import barometerIcon from "../assets/weather-icons/barometer.svg";
import uvIcon from "../assets/weather-icons/uv-index.svg";
import windIcon from "../assets/weather-icons/wind.svg";
import raindropsIcon from "../assets/weather-icons/raindrops.svg";
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
    const weatherType = getWeatherType(weather?.weather_code);
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
        <div className={`weather-app weather-log weather-log--${view} weather-atmosphere-${weatherType}`}>
            <Header
                onUseLocation={requestLocation}
                onLocationSelect={selectLocation}
            />

            <main className="weather-log-content">
                <div className="weather-log-container">
                    {error && (
                        <div className="weather-log-error" role="alert">
                            <TriangleAlert size={18} strokeWidth={1} />
                            <span>{error}</span>
                            <button type="button" onClick={requestLocation}><RotateCcw size={16} />Retry</button>
                        </div>
                    )}

                    <section className="weather-log-location" aria-label="Selected location">
                        <div>
                            <h1>{locationName || (loading ? "Finding your location" : "Choose a location")}</h1>
                            {locationDetail && <p>{locationDetail}</p>}
                        </div>
                        <div className="weather-log-time">
                            {locationTime && <strong>{locationTime}</strong>}
                            <span>{updatedTime ? `Weather updated at ${updatedTime}` : loading ? "Getting local weather" : "Update time unavailable"}</span>
                        </div>
                    </section>

                    <section className="weather-log-current" aria-labelledby="current-weather-title">
                        {weather && (
                            <WeatherEnvironment
                                code={weather.weather_code}
                                isDay={isDay}
                                className="weather-log-atmosphere"
                            />
                        )}
                        <div className="weather-log-current-copy">
                            <h2 id="current-weather-title">Current weather</h2>
                            <div className="weather-log-reading">
                                <span className="weather-log-temperature" aria-label={weather?.temperature == null ? "Temperature unavailable" : `${Math.round(weather.temperature)} degrees`}>
                                    {weather?.temperature == null ? "--" : Math.round(weather.temperature)}
                                    <span>{tempUnit}</span>
                                </span>
                                <div className="weather-log-condition">
                                    <WeatherIllustration code={weather?.weather_code} isDay={isDay} size={52} animated={false} />
                                    <strong>{weather ? weatherLabel(weather.weather_code) : loading ? "Waiting for local conditions" : "Weather unavailable"}</strong>
                                </div>
                            </div>
                            <div className="weather-log-summary">
                                <span>Feels like <strong>{weather?.feels_like == null ? "--" : `${Math.round(weather.feels_like)}${tempUnit}`}</strong></span>
                                <span>Today <strong>H {tempHigh == null ? "--" : `${Math.round(tempHigh)}${tempUnit}`}</strong><span className="weather-log-low">L {tempLow == null ? "--" : `${Math.round(tempLow)}${tempUnit}`}</span></span>
                            </div>
                        </div>
                    </section>

                    <section className="weather-log-section weather-log-hourly" aria-labelledby="hourly-heading">
                        <div className="weather-log-section-heading">
                            <div><h2 id="hourly-heading">Next 12 hours</h2><p>Temperature and chance of rain</p></div>
                        </div>
                        {hourlyTimes.length ? (
                            <ol className="hourly-timeline">
                                {hourlyTimes.map((time, index) => {
                                    const hourIndex = currentHourIndex + index;
                                    const chance = hourly.precipitation_probability?.[hourIndex];
                                    return (
                                        <li className={index === 0 ? "is-current" : ""} key={time}>
                                            <span className="hourly-time">{index === 0 ? "Now" : formatTime(time)}</span>
                                            <WeatherIllustration code={hourly.weather_code?.[hourIndex]} isDay={isForecastHourDay(time, forecast)} size={34} animated={false} />
                                            <strong className="hourly-temperature">{hourly.temperature_2m?.[hourIndex] == null ? "--" : `${Math.round(hourly.temperature_2m[hourIndex])}°`}</strong>
                                            <span className="hourly-rain" aria-label={chance == null ? "Rain chance unavailable" : `${Math.round(chance)} percent chance of rain`}>
                                                {chance == null ? "--" : `${Math.round(chance)}%`}
                                            </span>
                                        </li>
                                    );
                                })}
                            </ol>
                        ) : <p className="weather-log-empty">{loading ? "Loading hourly forecast…" : "Hourly forecast is unavailable for this location."}</p>}
                    </section>

                    <section className="weather-log-section weather-log-rain" aria-labelledby="rain-heading">
                        <div className="weather-log-section-heading">
                            <div><h2 id="rain-heading">Rain outlook</h2><p>Chance of precipitation over the next 12 hours</p></div>
                            <img src={raindropsIcon} alt="" width="30" height="30" />
                        </div>
                        <div className="rain-outlook-reading">
                            <strong>{maxRainChance == null ? "--" : `${Math.round(maxRainChance)}%`}</strong>
                            <p>{maxRainChance == null
                                ? "Rain probability is unavailable."
                                : maxRainChance === 0
                                    ? "No rain is expected in the next 12 hours."
                                    : `Highest chance ${nextRainIndex >= 0 ? `around ${formatTime(hourly?.time?.[futureHourIndex + nextRainIndex])}` : "in the next 12 hours"}.`}</p>
                        </div>
                    </section>

                    <section className="weather-log-section weather-log-daily" aria-labelledby="daily-heading">
                        <div className="weather-log-section-heading">
                            <div><h2 id="daily-heading">Today and the week ahead</h2><p>Daily conditions, high and low temperatures, and rain chance</p></div>
                        </div>
                        {dailyTimes.length ? (
                            <div className="daily-forecast-table" role="table" aria-label="Seven-day forecast">
                                <div className="daily-column-labels" role="row">
                                    <span role="columnheader">Day</span>
                                    <span aria-hidden="true"></span>
                                    <span role="columnheader">Condition</span>
                                    <span role="columnheader">Chance of rain</span>
                                    <span role="columnheader">Low</span>
                                    <span role="columnheader">High</span>
                                </div>
                                {dailyTimes.map((date, index) => {
                                    const dayIndex = todayIndex + index;
                                    const dayName = index === 0 ? "Today" : index === 1 ? "Tomorrow" : shortDay(date);
                                    return (
                                        <div className="daily-forecast-row" role="row" key={date}>
                                            <strong className="daily-day" role="cell">{dayName}</strong>
                                            <WeatherIllustration code={daily.weather_code?.[dayIndex]} isDay size={34} animated={false} />
                                            <span className="daily-condition" role="cell">{weatherLabel(daily.weather_code?.[dayIndex])}</span>
                                            <span className="daily-rain" role="cell">{daily.precipitation_probability_max?.[dayIndex] == null ? "Rain --" : `Rain ${Math.round(daily.precipitation_probability_max[dayIndex])}%`}</span>
                                            <span className="daily-low" role="cell" aria-label="Low temperature">{daily.temperature_2m_min?.[dayIndex] == null ? "--" : `${Math.round(daily.temperature_2m_min[dayIndex])}°`}</span>
                                            <strong className="daily-high" role="cell" aria-label="High temperature">{daily.temperature_2m_max?.[dayIndex] == null ? "--" : `${Math.round(daily.temperature_2m_max[dayIndex])}°`}</strong>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : <p className="weather-log-empty">{loading ? "Loading daily forecast…" : "Daily forecast is unavailable for this location."}</p>}
                    </section>

                    <section className="weather-log-section weather-log-alerts" aria-labelledby="alerts-heading">
                        <div className="weather-log-section-heading">
                            <div><h2 id="alerts-heading">Weather notices</h2><p>Official warnings and WeatherWatch risk assessment</p></div>
                            <Link to="/alerts" className="weather-log-text-link">All alerts <ArrowRight size={15} aria-hidden="true" /></Link>
                        </div>
                        <div className="weather-notice-row">
                            <span className={`notice-severity ${officialAlerts.length ? "is-severe" : "is-clear"}`}>{officialAlerts.length ? "Official warning" : "Official alerts"}</span>
                            <div>
                                <strong>{officialAlerts.length ? officialAlerts[0].title || "Warning for this location" : alerts?.message || "Official warning source is not connected."}</strong>
                                {officialAlerts.length > 0 && <p>{officialAlerts[0].description || officialAlerts[0].message || "See the full alert details for guidance."}</p>}
                            </div>
                        </div>
                        <div className="weather-notice-row">
                            <span className={`notice-severity ${risk?.level === "HIGH" || risk?.level === "SEVERE" ? "is-severe" : risk?.level === "MODERATE" ? "is-watch" : "is-clear"}`}>WeatherWatch assessment</span>
                            <div><strong>{risk?.level || "Assessment unavailable"}</strong><p>This application-generated assessment is not an official emergency warning.</p></div>
                        </div>
                    </section>

                    <section className="weather-log-section weather-log-details" aria-labelledby="details-heading">
                        <div className="weather-log-section-heading">
                            <div><h2 id="details-heading">Weather details</h2><p>Measurements for {locationName || "this location"}</p></div>
                        </div>
                        <dl className="weather-details-list">
                            <div><dt><img src={windIcon} alt="" />Wind</dt><dd>{weather?.wind_speed == null ? "Unavailable" : `${Math.round(weather.wind_speed)} ${weather?.units?.wind_speed_10m || "km/h"}`}<small>{weather?.wind_direction == null ? "" : `From ${windDirectionLabel(weather.wind_direction)}`}</small></dd></div>
                            <div><dt><img src={humidityIcon} alt="" />Humidity</dt><dd>{weather?.humidity == null ? "Unavailable" : `${Math.round(weather.humidity)}%`}<small>Moisture in the air</small></dd></div>
                            <div><dt><img src={barometerIcon} alt="" />Air pressure</dt><dd>{weather?.pressure == null ? "Unavailable" : `${Math.round(weather.pressure)} ${weather?.units?.pressure_msl || "hPa"}`}<small>Pressure at sea level</small></dd></div>
                            <div><dt>Visibility</dt><dd>{weather?.visibility == null ? "Unavailable" : `${(weather.visibility / 1000).toFixed(1)} km`}<small>How far you can see</small></dd></div>
                            <div><dt><img src={uvIcon} alt="" />UV Index</dt><dd>{weather?.uv_index == null ? "Unavailable" : Math.round(weather.uv_index)}<small>{uv.label || "Index unavailable"}</small></dd></div>
                            <div><dt><img src={raindropsIcon} alt="" />Precipitation</dt><dd>{weather?.precipitation == null ? "Unavailable" : `${weather.precipitation} ${weather?.units?.precipitation || "mm"}`}<small>Measured at the latest update</small></dd></div>
                        </dl>
                    </section>

                    <section className="weather-log-section weather-log-sun" aria-labelledby="sun-heading">
                        <div className="weather-log-section-heading">
                            <div><h2 id="sun-heading">Daylight</h2><p>For today in {locationName || "this location"}</p></div>
                        </div>
                        <div className="daylight-times">
                            <div><img src={sunriseIcon} alt="" /><span>Sunrise</span><strong>{formatTime(todaySunrise)}</strong></div>
                            <div><img src={sunsetIcon} alt="" /><span>Sunset</span><strong>{formatTime(todaySunset)}</strong></div>
                        </div>
                    </section>

                    <section className="weather-log-section weather-log-map" aria-labelledby="map-heading">
                        <div className="weather-log-section-heading">
                            <div><h2 id="map-heading">Weather map</h2><p>Satellite imagery with the RainViewer precipitation radar overlay</p></div>
                            <Link to="/satellite-radar" className="weather-log-text-link">Open map <ArrowRight size={15} aria-hidden="true" /></Link>
                        </div>
                        <Link className="weather-map-entry" to="/satellite-radar">
                            <span><strong>Explore the weather map</strong><span>View recent rain radar over satellite imagery, with layer and time controls.</span></span>
                            <ArrowRight size={20} aria-hidden="true" />
                        </Link>
                    </section>

                    <footer className="weather-log-footer">
                        Weather data from Open-Meteo. Radar imagery from RainViewer; satellite basemap from Esri.
                    </footer>
                </div>
            </main>
        </div>
    );
}