import { Eye } from "lucide-react";
import { useEffect, useState } from "react";

import Header from "../components/Header";
import WeatherCard from "../components/WeatherCard";
import WeatherEnvironment from "../components/WeatherEnvironment";
import WeatherIllustration from "../components/WeatherIllustration";
import { weatherLabel } from "../components/WeatherVisual";
import { getCurrentWeather, reverseLocation } from "../services/api";
import thermometerIcon from "../assets/weather-icons/thermometer.svg";
import humidityIcon from "../assets/weather-icons/humidity.svg";
import windIcon from "../assets/weather-icons/wind.svg";
import barometerIcon from "../assets/weather-icons/barometer.svg";
import uvIcon from "../assets/weather-icons/uv-index.svg";
import raindropsIcon from "../assets/weather-icons/raindrops.svg";

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

    return (
        <div className="weather-app">
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
                            <section className="current-weather-hero">
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
                            </section>

                            <div className="weather-card-grid current-weather-detail-grid">
                                <WeatherCard iconSrc={thermometerIcon} label="Feels Like" value={weather.feels_like} unit={weather.units?.apparent_temperature || "°C"} />
                                <WeatherCard iconSrc={humidityIcon} label="Humidity" value={weather.humidity} unit={weather.units?.relative_humidity_2m || "%"} />
                                <WeatherCard iconSrc={windIcon} label="Wind" value={weather.wind_speed} unit={weather.units?.wind_speed_10m || "km/h"} />
                                <WeatherCard iconSrc={barometerIcon} label="Pressure" value={weather.pressure} unit={weather.units?.pressure_msl || "hPa"} />
                                <WeatherCard icon={Eye} label="Visibility" value={weather.visibility == null ? null : Math.round(weather.visibility / 1000)} unit="km" />
                                <WeatherCard iconSrc={uvIcon} label="UV Index" value={weather.uv_index} />
                                <WeatherCard iconSrc={raindropsIcon} label="Precipitation" value={weather.precipitation} unit={weather.units?.precipitation || "mm"} />
                                <WeatherCard iconSrc={windIcon} label="Wind Gust" value={weather.wind_gust} unit={weather.units?.wind_gusts_10m || "km/h"} />
                            </div>
                        </>
                    )}
                </div>
            </main>
        </div>
    );
}