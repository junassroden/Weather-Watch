import { useEffect, useState } from "react";

import Header from "../components/Header";
import WeatherEnvironment from "../components/WeatherEnvironment";
import WeatherIllustration from "../components/WeatherIllustration";
import { getWeatherType, weatherLabel } from "../components/WeatherVisual";
import { getCurrentWeather, reverseLocation } from "../services/api";

export default function CurrentWeather() {
    const [weather, setWeather] = useState(null);
    const [locationName, setLocationName] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const loadWeather = async (latitude, longitude, searchedLocation = "") => {
        setLoading(true);
        setError("");

        try {
            // Resolved together so the reading and its location label can
            // never come from two different places.
            const [weatherData, locationData] = await Promise.all([
                getCurrentWeather(latitude, longitude),
                reverseLocation(latitude, longitude),
            ]);

            setWeather(weatherData);
            setLocationName(
                searchedLocation
                || locationData.city
                || locationData.display_name
                || "Current Location"
            );
        } catch {
            setError("Unable to retrieve current weather information.");
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

    const isDay = weather?.is_day !== 0;
    const weatherType = getWeatherType(weather?.weather_code);

    return (
        <div className={`weather-app weather-atmosphere-${weatherType}`}>
            <Header
                onUseLocation={requestLocation}
                onLocationSelect={(result) => loadWeather(result.latitude, result.longitude, result.name)}
            />

            <main className="page-content">
                <div className="container">
                    <div className="page-header">
                        <span className="eyebrow">CURRENT WEATHER</span>
                        <h1>{locationName || "Current Weather"}</h1>
                        <p>Detailed live conditions for your selected location.</p>
                    </div>

                    {error && <div className="error-panel"><span>{error}</span></div>}
                    {loading && !weather && <div className="page-loading">Loading current weather...</div>}

                    {weather && (
                        <>
                            <section className="current-weather-composition">
                                <div className="current-weather-hero">
                                <WeatherEnvironment code={weather.weather_code} isDay={isDay} className="hero-scene" />
                                <div className="current-weather-copy">
                                    <span className="eyebrow">LIVE CONDITIONS</span>
                                    <div className="current-temperature">
                                        {weather.temperature == null ? "--" : Math.round(weather.temperature)}
                                        <span>{weather.units?.temperature_2m || "°C"}</span>
                                    </div>
                                    <div className="current-weather-condition">
                                        <WeatherIllustration code={weather.weather_code} isDay={isDay} size={44} />
                                        {weatherLabel(weather.weather_code)}
                                    </div>
                                </div>
                                </div>

                                <div className="current-weather-metrics">
                                    <div className="current-weather-metric metric-primary">
                                        <span>Feels like</span>
                                        <strong>{weather.feels_like == null ? "--" : Math.round(weather.feels_like)}<small>{weather.units?.apparent_temperature || "°C"}</small></strong>
                                    </div>
                                    <div className="current-weather-metric">
                                        <span>Humidity</span>
                                        <strong>{weather.humidity == null ? "--" : Math.round(weather.humidity)}<small>{weather.units?.relative_humidity_2m || "%"}</small></strong>
                                    </div>
                                    <div className="current-weather-metric">
                                        <span>Wind</span>
                                        <strong>{weather.wind_speed == null ? "--" : Math.round(weather.wind_speed)}<small>{weather.units?.wind_speed_10m || "km/h"}</small></strong>
                                    </div>
                                    <div className="current-weather-metric">
                                        <span>Pressure</span>
                                        <strong>{weather.pressure == null ? "--" : Math.round(weather.pressure)}<small>{weather.units?.pressure_msl || "hPa"}</small></strong>
                                    </div>
                                    <div className="current-weather-metric">
                                        <span>Visibility</span>
                                        <strong>{weather.visibility == null ? "--" : Math.round(weather.visibility / 1000)}<small>km</small></strong>
                                    </div>
                                    <div className="current-weather-metric">
                                        <span>UV index</span>
                                        <strong>{weather.uv_index == null ? "--" : Math.round(weather.uv_index)}</strong>
                                    </div>
                                    <div className="current-weather-metric">
                                        <span>Precipitation</span>
                                        <strong>{weather.precipitation == null ? "--" : weather.precipitation}<small>{weather.units?.precipitation || "mm"}</small></strong>
                                    </div>
                                    <div className="current-weather-metric">
                                        <span>Wind gust</span>
                                        <strong>{weather.wind_gust == null ? "--" : Math.round(weather.wind_gust)}<small>{weather.units?.wind_gusts_10m || "km/h"}</small></strong>
                                    </div>
                                </div>
                            </section>
                        </>
                    )}
                </div>
            </main>
        </div>
    );
}