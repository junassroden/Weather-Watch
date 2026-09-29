import { useEffect, useState } from "react";
import { Eye, Wind } from "lucide-react";

import Header from "../components/Header";
import WeatherCard from "../components/WeatherCard";
import StatCard from "../components/StatCard";
import { getWeatherType } from "../components/WeatherVisual";
import { getCurrentWeather, getForecast, reverseLocation } from "../services/api";
import humidityIcon from "../assets/weather-icons/humidity.svg";
import barometerIcon from "../assets/weather-icons/barometer.svg";
import uvIcon from "../assets/weather-icons/uv-index.svg";
import raindropsIcon from "../assets/weather-icons/raindrops.svg";

export default function CurrentWeather() {
    const [weather, setWeather] = useState(null);
    const [locationName, setLocationName] = useState("");
    const [forecast, setForecast] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const loadWeather = async (latitude, longitude, searchedLocation = "") => {
        setLoading(true);
        setError("");

        try {
            // Resolved together so the reading and its location label can
            // never come from two different places.
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
                        <div className="current-weather-layout">
                            <WeatherCard
                                weather={weather}
                                forecast={forecast}
                                locationName={locationName}
                                isDay={isDay}
                                loading={loading}
                            />

                            <div className="current-weather-details glass-panel">
                                <StatCard
                                    title="Humidity"
                                    iconSrc={humidityIcon}
                                    value={weather.humidity == null ? null : Math.round(weather.humidity)}
                                    unit={weather.units?.relative_humidity_2m || "%"}
                                />

                                <StatCard
                                    title="Wind"
                                    icon={Wind}
                                    value={weather.wind_speed == null ? null : Math.round(weather.wind_speed)}
                                    unit={weather.units?.wind_speed_10m || "km/h"}
                                />

                                <StatCard
                                    title="Pressure"
                                    iconSrc={barometerIcon}
                                    value={weather.pressure == null ? null : Math.round(weather.pressure)}
                                    unit={weather.units?.pressure_msl || "hPa"}
                                />

                                <StatCard
                                    title="Visibility"
                                    icon={Eye}
                                    value={weather.visibility == null ? null : Math.round(weather.visibility / 1000)}
                                    unit="km"
                                />

                                <StatCard
                                    title="UV index"
                                    iconSrc={uvIcon}
                                    value={weather.uv_index == null ? null : Math.round(weather.uv_index)}
                                />

                                <StatCard
                                    title="Precipitation"
                                    iconSrc={raindropsIcon}
                                    value={weather.precipitation == null ? null : weather.precipitation}
                                    unit={weather.units?.precipitation || "mm"}
                                />

                                <StatCard
                                    title="Wind gust"
                                    icon={Wind}
                                    value={weather.wind_gust == null ? null : Math.round(weather.wind_gust)}
                                    unit={weather.units?.wind_gusts_10m || "km/h"}
                                />
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}