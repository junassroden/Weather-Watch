import { Droplets, Gauge, Wind } from "lucide-react";
import { useEffect, useState } from "react";

import Header from "../components/Header";
import WeatherCard from "../components/WeatherCard";
import WeatherEnvironment from "../components/WeatherEnvironment";
import WeatherIcon, { weatherLabel } from "../components/WeatherVisual";
import { getCurrentWeather } from "../services/api";

export default function CurrentWeather() {
    const [weather, setWeather] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!navigator.geolocation) {
            setError("Geolocation is not supported by this browser.");
            setLoading(false);
            return;
        }

        navigator.geolocation.getCurrentPosition(async ({ coords }) => {
            try {
                setWeather(await getCurrentWeather(coords.latitude, coords.longitude));
            } catch {
                setError("Unable to retrieve current weather information.");
            } finally {
                setLoading(false);
            }
        }, () => {
            setError("Location permission was denied.");
            setLoading(false);
        });
    }, []);

    return (
        <div className="weather-app">
            <Header />
            <main className="page-content">
                <div className="container">
                    <div className="page-header">
                        <span className="eyebrow">CURRENT WEATHER</span>
                        <h1>Current Weather</h1>
                        <p>Detailed live conditions from your current location.</p>
                    </div>
                    {loading && <div className="page-loading">Loading current weather...</div>}
                    {error && <div className="error-panel">{error}</div>}
                    {!loading && weather && (
                        <>
                            <section className="current-weather-hero current-weather-page-hero">
                                <WeatherEnvironment code={weather.weather_code} isDay={weather.is_day !== 0} className="hero-scene" />
                                <div className="current-weather-copy">
                                    <span className="eyebrow">LIVE CONDITIONS</span>
                                    <div className="current-temperature">{Math.round(weather.temperature)}<span>{weather.units?.temperature_2m || "°C"}</span></div>
                                    <div className="current-weather-condition"><WeatherIcon code={weather.weather_code} isDay={weather.is_day !== 0} size={20} />{weatherLabel(weather.weather_code)}</div>
                                </div>
                            </section>
                            <div className="weather-card-grid current-weather-detail-grid">
                                <WeatherCard icon={Droplets} label="Humidity" value={weather.humidity} unit={weather.units?.relative_humidity_2m || "%"} />
                                <WeatherCard icon={Wind} label="Wind" value={weather.wind_speed} unit={weather.units?.wind_speed_10m || "km/h"} />
                                <WeatherCard icon={Gauge} label="Pressure" value={weather.pressure} unit={weather.units?.pressure_msl || "hPa"} />
                            </div>
                        </>
                    )}
                </div>
            </main>
        </div>
    );
}