import {
    AlertTriangle,
    CloudRain,
    Droplets,
    LocateFixed,
    MapPin,
    RefreshCw,
    Wind,
} from "lucide-react";
import { useEffect, useState } from "react";

import Header from "./Header";
import ForecastCard from "./ForecastCard";
import WeatherEnvironment from "./WeatherEnvironment";
import WeatherIcon, { weatherLabel } from "./WeatherVisual";
import { getCurrentWeather, getForecast, reverseLocation } from "../services/api";

function formatHour(time) {
    if (!time) return "--";

    return new Date(time).toLocaleTimeString([], {
        hour: "numeric",
        minute: "2-digit",
    });
}

function formatDateTime() {
    return new Intl.DateTimeFormat([], {
        weekday: "long",
        month: "long",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
    }).format(new Date());
}

function isForecastHourDay(time, forecast) {
    const date = time?.slice(0, 10);
    const dayIndex = forecast?.daily?.time?.indexOf(date) ?? -1;
    const sunrise = forecast?.daily?.sunrise?.[dayIndex];
    const sunset = forecast?.daily?.sunset?.[dayIndex];

    if (!sunrise || !sunset) return true;

    const timestamp = new Date(time).getTime();
    return timestamp >= new Date(sunrise).getTime()
        && timestamp <= new Date(sunset).getTime();
}

function weatherDescription(code) {
    return code == null ? "Waiting for conditions" : weatherLabel(code);
}

export default function ForecastExperience() {
    const [locationName, setLocationName] = useState("");
    const [weather, setWeather] = useState(null);
    const [forecast, setForecast] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [updatedAt, setUpdatedAt] = useState(formatDateTime());

    const loadWeather = async (latitude, longitude, searchedLocation = "") => {
        setLoading(true);
        setError("");

        try {
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
            setUpdatedAt(formatDateTime());
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
                setError("Location permission was denied. Please allow location access to view local weather.");
                setLoading(false);
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 300000,
            }
        );
    };

    useEffect(() => {
        requestLocation();
    }, []);

    const daily = forecast?.daily;
    const hourly = forecast?.hourly;
    const todayHigh = daily?.temperature_2m_max?.[0];
    const todayLow = daily?.temperature_2m_min?.[0];

    return (
        <div className="weather-app">
            <Header
                onUseLocation={requestLocation}
                onLocationSelect={(result) => loadWeather(result.latitude, result.longitude, result.name)}
            />

            <main>
                <section className="hero-section forecast-landing">
                    <div className="container">
                        <div className="hero-heading">
                            <div>
                                <span className="eyebrow">FORECAST DESK</span>
                                <h1>{locationName || "Your local forecast"}</h1>
                                <p className="hero-kicker">{updatedAt}</p>
                            </div>
                            {locationName && (
                                <div className="current-location-badge">
                                    <MapPin size={15} />
                                    <span>{locationName}</span>
                                </div>
                            )}
                        </div>

                        <div className="current-weather-hero">
                            <WeatherEnvironment code={weather?.weather_code} isDay={weather?.is_day !== 0} className="hero-scene" />
                            <div className="current-weather-copy">
                                <span className="eyebrow">CURRENT WEATHER</span>
                                <div className="current-temperature">
                                    {weather?.temperature == null ? "--" : Math.round(weather.temperature)}
                                    <span>{weather?.units?.temperature_2m || "°C"}</span>
                                </div>
                                <div className="current-weather-condition">
                                    <WeatherIcon code={weather?.weather_code} isDay={weather?.is_day !== 0} size={20} />
                                    {weatherDescription(weather?.weather_code)}
                                </div>
                                <span className="current-weather-meta">
                                    {weather?.feels_like == null ? "Feels like --" : `Feels like ${Math.round(weather.feels_like)}${weather?.units?.apparent_temperature || "°C"}`}
                                    {todayHigh != null && todayLow != null && ` · High ${Math.round(todayHigh)}° · Low ${Math.round(todayLow)}°`}
                                </span>
                                <div className="current-weather-stats">
                                    <div className="current-weather-stat"><Droplets size={15} /><span>{weather?.humidity == null ? "--" : `${Math.round(weather.humidity)}%`}</span><small>Humidity</small></div>
                                    <div className="current-weather-stat"><Wind size={15} /><span>{weather?.wind_speed == null ? "--" : `${Math.round(weather.wind_speed)} ${weather?.units?.wind_speed_10m || "km/h"}`}</span><small>Wind</small></div>
                                    <div className="current-weather-stat"><CloudRain size={15} /><span>{weather?.precipitation == null ? "--" : `${weather.precipitation} ${weather?.units?.precipitation || "mm"}`}</span><small>Precipitation</small></div>
                                </div>
                            </div>
                        </div>

                        <section className="hourly-panel glass-panel">
                            <div className="section-heading">
                                <div><span className="eyebrow">NEXT 24 HOURS</span><h2>Hourly Forecast</h2></div>
                            </div>
                            <div className="forecast-grid hourly-strip">
                                {hourly?.time?.length ? hourly.time.slice(0, 8).map((time, index) => {
                                    const code = hourly.weather_code?.[index];
                                    const isDay = isForecastHourDay(time, forecast);

                                    return (
                                        <article className="forecast-card" key={time}>
                                            <WeatherEnvironment code={code} isDay={isDay} className="forecast-scene" />
                                            <div className="forecast-card-scrim" aria-hidden="true" />
                                            <div className="forecast-card-top"><div className="forecast-date glass-chip"><strong>{index === 0 ? "Now" : formatHour(time)}</strong></div></div>
                                            <div className="forecast-card-bottom glass-panel-frost">
                                                <div className="forecast-condition"><WeatherIcon code={code} isDay={isDay} size={14} />{weatherLabel(code)}</div>
                                                <div className="forecast-temperature"><strong>{hourly.temperature_2m?.[index] == null ? "--" : `${Math.round(hourly.temperature_2m[index])}°`}</strong></div>
                                                <div className="forecast-rain"><CloudRain size={13} /><span>{hourly.precipitation_probability?.[index] == null ? "--" : `${Math.round(hourly.precipitation_probability[index])}% rain`}</span></div>
                                            </div>
                                        </article>
                                    );
                                }) : <div className="hourly-empty">{loading ? "Reading forecast data..." : "Hourly forecast unavailable for this location."}</div>}
                            </div>
                        </section>
                    </div>
                </section>

                <div className="page-content">
                    <div className="container">
                        {error && (
                            <div className="error-panel">
                                <AlertTriangle size={18} /><span>{error}</span>
                                <button onClick={requestLocation}><RefreshCw size={15} />Retry</button>
                            </div>
                        )}
                        {loading && !weather && <div className="page-loading"><LocateFixed size={18} />Loading local forecast...</div>}
                        {!loading && !weather && !error && <div className="page-loading">No weather data is available for this location.</div>}

                        <section className="dashboard-section">
                            <div className="section-heading"><div><span className="eyebrow">7-DAY OUTLOOK</span><h2>Weekly Forecast</h2></div></div>
                            {daily?.time?.length ? (
                                <div className="forecast-grid">
                                    {daily.time.slice(0, 7).map((date, index) => (
                                        <ForecastCard key={date} date={date} weatherCode={daily.weather_code?.[index]} max={daily.temperature_2m_max?.[index]} min={daily.temperature_2m_min?.[index]} precipitation={daily.precipitation_probability_max?.[index]} />
                                    ))}
                                </div>
                            ) : !loading && <div className="no-data-panel">Weekly forecast data is unavailable.</div>}
                        </section>
                    </div>
                </div>
            </main>
        </div>
    );
}