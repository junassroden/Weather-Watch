import {
    CloudRain,
    Droplets,
    Eye,
    Gauge,
    MapPin,
    Sun,
    Thermometer,
    Wind,
    Sunrise,
    Sunset,
    AlertTriangle,
    Phone,
    RefreshCw,
} from "lucide-react";

import {
    useEffect,
    useState,
} from "react";

import Header from "../components/Header";
import LiveWeatherMap from "../components/LiveWeatherMap";
import WeatherCard from "../components/WeatherCard";
import ForecastCard from "../components/ForecastCard";
import RiskCard from "../components/RiskCard";
import WeatherVisual, {
    weatherLabel,
} from "../components/WeatherVisual";

import {
    getCurrentWeather,
    getForecast,
    getRisk,
    getAlerts,
    reverseLocation,
} from "../services/api";

function weatherDescription(code) {
    if (code === 0) {
        return "Clear sky";
    }

    return weatherLabel(code);
}

export default function Dashboard() {
    const [location, setLocation] =
        useState(null);

    const [locationName, setLocationName] =
        useState("");

    const [weather, setWeather] =
        useState(null);

    const [forecast, setForecast] =
        useState(null);

    const [risk, setRisk] =
        useState(null);

    const [alerts, setAlerts] =
        useState(null);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    const loadWeather = (
        latitude,
        longitude
    ) => {
        setLoading(true);
        setError("");

        Promise.all([
            getCurrentWeather(
                latitude,
                longitude
            ),
            getForecast(
                latitude,
                longitude
            ),
            getRisk(
                latitude,
                longitude
            ),
            getAlerts(
                latitude,
                longitude
            ),
            reverseLocation(
                latitude,
                longitude
            ),
        ])
            .then(
                ([
                    weatherData,
                    forecastData,
                    riskData,
                    alertData,
                    locationData,
                ]) => {
                    setWeather(
                        weatherData
                    );

                    setForecast(
                        forecastData
                    );

                    setRisk(
                        riskData
                    );

                    setAlerts(
                        alertData
                    );

                    setLocationName(
                        locationData.city ||
                        locationData.display_name ||
                        "Current Location"
                    );
                }
            )
            .catch(() => {
                setError(
                    "Unable to retrieve weather information."
                );
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const requestLocation =
        () => {
            if (
                !navigator.geolocation
            ) {
                setError(
                    "Geolocation is not supported by this browser."
                );

                setLoading(false);

                return;
            }

            setLoading(true);

            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const latitude =
                        position.coords
                            .latitude;

                    const longitude =
                        position.coords
                            .longitude;

                    setLocation({
                        latitude,
                        longitude,
                    });

                    loadWeather(
                        latitude,
                        longitude
                    );
                },
                () => {
                    setError(
                        "Location permission was denied. Please allow location access to view local weather."
                    );

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

    const daily =
        forecast?.daily;

    return (
        <div className="weather-app">

            <Header />

            <main>

                <section className="hero-section">

                    <div className="container">

                        <div className="hero-heading">

                            <div>

                                <span className="eyebrow">
                                    REAL-TIME WEATHER MONITORING
                                </span>

                                <h1>
                                    {locationName || "Your local weather"}
                                </h1>

                                <p className="hero-kicker">
                                    Live conditions and precipitation radar
                                </p>

                            </div>

                            {locationName && (
                                <div className="current-location-badge">

                                    <MapPin size={17} />

                                    <span>
                                        {locationName}
                                    </span>

                                </div>
                            )}

                        </div>

                        <div className="current-weather-hero">
                            <WeatherVisual
                                code={weather?.weather_code}
                                isDay={weather?.is_day !== 0}
                                size="large"
                            />

                            <div className="current-weather-copy">
                                <span className="eyebrow">CURRENT CONDITIONS</span>
                                <div className="current-temperature">
                                    {weather?.temperature == null ? "--" : Math.round(weather.temperature)}
                                    <span>{weather?.units?.temperature_2m || "°C"}</span>
                                </div>
                                <strong>{weather ? weatherDescription(weather.weather_code) : "Waiting for conditions"}</strong>
                                <span className="current-weather-meta">
                                    Feels like {weather?.feels_like == null ? "--" : `${Math.round(weather.feels_like)}${weather?.units?.apparent_temperature || "°C"}`}
                                </span>
                            </div>
                        </div>

                        <LiveWeatherMap
                            latitude={
                                location?.latitude
                            }
                            longitude={
                                location?.longitude
                            }
                        />

                    </div>

                </section>

                {error && (
                    <section className="container">

                        <div className="error-panel">

                            <AlertTriangle
                                size={20}
                            />

                            <span>
                                {error}
                            </span>

                            <button
                                onClick={
                                    requestLocation
                                }
                            >
                                <RefreshCw
                                    size={17}
                                />

                                Retry
                            </button>

                        </div>

                    </section>
                )}

                <section className="container dashboard-section">

                    <div className="section-heading">

                        <div>
                            <span className="eyebrow">
                                CURRENT CONDITIONS
                            </span>

                            <h2>
                                Weather Now
                            </h2>
                        </div>

                        {weather?.updated_at && (
                            <span className="updated-time">
                                Updated{" "}
                                {new Date(
                                    weather.updated_at
                                ).toLocaleTimeString(
                                    [],
                                    {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                    }
                                )}
                            </span>
                        )}

                    </div>

                    <div className="weather-card-grid">

                        <WeatherCard
                            icon={Thermometer}
                            label="Temperature"
                            value={
                                weather?.temperature
                            }
                            unit={weather?.units?.temperature_2m || "°C"}
                            description={
                                weather
                                    ? weatherDescription(
                                        weather.weather_code
                                    )
                                    : ""
                            }
                        />

                        <WeatherCard
                            icon={Thermometer}
                            label="Feels Like"
                            value={
                                weather?.feels_like
                            }
                            unit={weather?.units?.apparent_temperature || "°C"}
                        />

                        <WeatherCard
                            icon={Droplets}
                            label="Humidity"
                            value={
                                weather?.humidity
                            }
                            unit={weather?.units?.relative_humidity_2m || "%"}
                        />

                        <WeatherCard
                            icon={Wind}
                            label="Wind"
                            value={
                                weather?.wind_speed
                            }
                            unit={weather?.units?.wind_speed_10m || "km/h"}
                        />

                        <WeatherCard
                            icon={Gauge}
                            label="Pressure"
                            value={
                                weather?.pressure
                            }
                            unit={weather?.units?.pressure_msl || "hPa"}
                        />

                        <WeatherCard
                            icon={Eye}
                            label="Visibility"
                            value={weather?.visibility == null
                                ? null
                                : Math.round(
                                    weather.visibility / 1000
                                )}
                            unit="km"
                        />

                        <WeatherCard
                            icon={Sun}
                            label="UV Index"
                            value={weather?.uv_index}
                            unit={weather?.units?.uv_index || ""}
                        />

                    </div>

                </section>

                <section className="container dashboard-section">

                    <div className="section-heading">

                        <div>
                            <span className="eyebrow">
                                WEATHER OVERVIEW
                            </span>

                            <h2>
                                Atmospheric Conditions
                            </h2>
                        </div>

                    </div>

                    <div className="overview-grid">

                        <div className="overview-card">
                            <CloudRain size={20} />
                            <span>
                                Precipitation
                            </span>
                            <strong>
                                {weather?.precipitation == null
                                    ? "Unavailable"
                                    : `${weather.precipitation} ${weather.units?.precipitation || "mm"}`}
                            </strong>
                        </div>

                        <div className="overview-card">
                            <CloudRain size={20} />
                            <span>
                                Cloud Cover
                            </span>
                            <strong>
                                {weather?.cloud_cover == null
                                    ? "Unavailable"
                                    : `${weather.cloud_cover} ${weather.units?.cloud_cover || "%"}`}
                            </strong>
                        </div>

                        <div className="overview-card">
                            <Wind size={20} />
                            <span>
                                Wind Gust
                            </span>
                            <strong>
                                {weather?.wind_gust == null
                                    ? "Unavailable"
                                    : `${weather.wind_gust} ${weather.units?.wind_gusts_10m || "km/h"}`}
                            </strong>
                        </div>

                        <div className="overview-card">
                            <Gauge size={20} />
                            <span>
                                Wind Direction
                            </span>
                            <strong>
                                {weather?.wind_direction == null
                                    ? "Unavailable"
                                    : `${weather.wind_direction} ${weather.units?.wind_direction_10m || "°"}`}
                            </strong>
                        </div>

                    </div>

                </section>

                <section className="container dashboard-section">

                    <div className="section-heading">

                        <div>
                            <span className="eyebrow">
                                7-DAY FORECAST
                            </span>

                            <h2>
                                Weekly Outlook
                            </h2>
                        </div>

                    </div>

                    <div className="forecast-grid">

                        {daily?.time?.slice(0, 5).map(
                            (date, index) => (
                                <ForecastCard
                                    key={date}
                                    date={date}
                                    weatherCode={
                                        daily.weather_code?.[
                                            index
                                        ]
                                    }
                                    max={
                                        daily.temperature_2m_max?.[
                                            index
                                        ]
                                    }
                                    min={
                                        daily.temperature_2m_min?.[
                                            index
                                        ]
                                    }
                                    precipitation={
                                        daily.precipitation_probability_max?.[
                                            index
                                        ]
                                    }
                                />
                            )
                        )}

                    </div>

                </section>

                <section className="container dashboard-section">

                    <div className="sun-grid">

                        <div className="sun-card">

                            <div className="sun-icon">
                                <Sunrise size={25} />
                            </div>

                            <div>
                                <span>
                                    SUNRISE
                                </span>

                                <strong>
                                    {daily?.sunrise?.[0]
                                        ? new Date(
                                            daily.sunrise[0]
                                        ).toLocaleTimeString(
                                            [],
                                            {
                                                hour: "2-digit",
                                                minute: "2-digit",
                                            }
                                        )
                                        : "--"}
                                </strong>
                            </div>

                        </div>

                        <div className="sun-card">

                            <div className="sun-icon">
                                <Sunset size={25} />
                            </div>

                            <div>
                                <span>
                                    SUNSET
                                </span>

                                <strong>
                                    {daily?.sunset?.[0]
                                        ? new Date(
                                            daily.sunset[0]
                                        ).toLocaleTimeString(
                                            [],
                                            {
                                                hour: "2-digit",
                                                minute: "2-digit",
                                            }
                                        )
                                        : "--"}
                                </strong>
                            </div>

                        </div>

                    </div>

                </section>

                <section className="container dashboard-section">

                    <div className="section-heading">

                        <div>
                            <span className="eyebrow">
                                SAFETY
                            </span>

                            <h2>
                                Weather Risk Assessment
                            </h2>
                        </div>

                    </div>

                    <RiskCard
                        risk={risk}
                    />

                </section>

                <section className="container dashboard-section">

                    <div className="alert-panel">

                        <div className="alert-panel-icon">
                            <AlertTriangle
                                size={24}
                            />
                        </div>

                        <div className="alert-panel-content">

                            <span>
                                LOCAL WEATHER ALERTS
                            </span>

                            <h3>
                                {alerts?.official_alerts?.length
                                    ? "Official alerts are active"
                                    : "No official alerts available"}
                            </h3>

                            <p>
                                {alerts?.message ||
                                    "Weather alert information is currently unavailable."}
                            </p>

                        </div>

                    </div>

                </section>

                <section className="container dashboard-section">

                    <div className="emergency-panel">

                        <div>

                            <span>
                                WEATHER EMERGENCY
                            </span>

                            <h2>
                                Need immediate emergency assistance?
                            </h2>

                            <p>
                                For emergencies in the
                                Philippines, contact the
                                national emergency hotline.
                            </p>

                        </div>

                        <a
                            href="tel:911"
                            className="emergency-button"
                        >
                            <Phone size={20} />
                            CALL 911
                        </a>

                    </div>

                </section>

            </main>

            <footer className="footer">

                <div className="container footer-inner">

                    <div>
                        <strong>
                            WeatherWatch
                        </strong>

                        <p>
                            Real-time weather monitoring
                            and forecasting platform.
                        </p>
                    </div>

                    <div className="footer-right">
                        Weather data powered by
                        Open-Meteo and RainViewer.
                    </div>

                </div>

            </footer>

        </div>
    );
}