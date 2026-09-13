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
import WeatherEnvironment from "../components/WeatherEnvironment";
import WeatherIcon, {
    getWeatherType,
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

function formatHour(time) {
    if (!time) {
        return "--";
    }

    return new Date(time).toLocaleTimeString([], {
        hour: "numeric",
        minute: "2-digit",
    });
}

function isForecastHourDay(time, forecast) {
    const daily = forecast?.daily;
    const date = time?.slice(0, 10);
    const dayIndex = daily?.time?.indexOf(date) ?? -1;

    if (dayIndex < 0 || !daily.sunrise?.[dayIndex] || !daily.sunset?.[dayIndex]) {
        return true;
    }

    const timestamp = new Date(time).getTime();
    return timestamp >= new Date(daily.sunrise[dayIndex]).getTime()
        && timestamp <= new Date(daily.sunset[dayIndex]).getTime();
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
        longitude,
        searchedLocation = ""
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
                        searchedLocation ||
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
                (geolocationError) => {
                    const errorMessage = {
                        1: "Location permission was denied. Please allow location access to view local weather.",
                        2: "Your location could not be determined. Check your device location settings and try again.",
                        3: "Location lookup timed out. Check your connection and try again.",
                    }[geolocationError.code] || "Unable to determine your location. Please try again.";

                    setError(
                        errorMessage
                    );

                    setLoading(false);
                },
                {
                    enableHighAccuracy: false,
                    timeout: 20000,
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

            <Header
                onUseLocation={requestLocation}
                onLocationSelect={(result) =>
                    loadWeather(
                        result.latitude,
                        result.longitude,
                        result.name
                    )
                }
            />

            <main>

                {/* PRIMARY: current-conditions hero + hourly outlook */}
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

                                    <MapPin size={15} />

                                    <span>
                                        {locationName}
                                    </span>

                                </div>
                            )}

                        </div>

                        <div className="current-weather-hero">
                            <WeatherEnvironment
                                code={weather?.weather_code}
                                isDay={weather?.is_day !== 0}
                                className="hero-scene"
                            />

                            <div className="current-weather-copy">
                                <span className="eyebrow">CURRENT CONDITIONS</span>

                                <div className="current-temperature">
                                    {weather?.temperature == null ? "--" : Math.round(weather.temperature)}
                                    <span>{weather?.units?.temperature_2m || "°C"}</span>
                                </div>

                                <div className="current-weather-condition">
                                    <WeatherIcon
                                        code={weather?.weather_code}
                                        isDay={weather?.is_day !== 0}
                                        size={20}
                                    />

                                    {weather ? weatherDescription(weather.weather_code) : "Waiting for conditions"}
                                </div>

                                <span className="current-weather-meta">
                                    Feels like {weather?.feels_like == null ? "--" : `${Math.round(weather.feels_like)}${weather?.units?.apparent_temperature || "°C"}`}
                                    {daily?.temperature_2m_max?.[0] != null && daily?.temperature_2m_min?.[0] != null && (
                                        <> · High {Math.round(daily.temperature_2m_max[0])}° · Low {Math.round(daily.temperature_2m_min[0])}°</>
                                    )}
                                </span>

                                <div className="current-weather-stats">
                                    <div className="current-weather-stat">
                                        <Droplets size={15} />
                                        <span>{weather?.humidity == null ? "--" : `${Math.round(weather.humidity)}%`}</span>
                                        <small>Humidity</small>
                                    </div>

                                    <div className="current-weather-stat">
                                        <Wind size={15} />
                                        <span>{weather?.wind_speed == null ? "--" : `${Math.round(weather.wind_speed)} ${weather?.units?.wind_speed_10m || "km/h"}`}</span>
                                        <small>Wind</small>
                                    </div>

                                    <div className="current-weather-stat">
                                        <CloudRain size={15} />
                                        <span>{weather?.precipitation == null ? "--" : `${weather.precipitation} ${weather?.units?.precipitation || "mm"}`}</span>
                                        <small>Precipitation</small>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <section className="hourly-panel glass-panel">
                            <div className="section-heading">
                                <div>
                                    <span className="eyebrow">
                                        NEXT 24 HOURS
                                    </span>

                                    <h2>
                                        Hourly Forecast
                                    </h2>
                                </div>
                            </div>

                            <div className="hourly-strip">
                                {forecast?.hourly?.time?.length ? (
                                    forecast.hourly.time.slice(0, 8).map(
                                        (time, index) => {
                                            const hourCode = forecast.hourly.weather_code?.[index];
                                            const hourIsDay = isForecastHourDay(time, forecast);

                                            return (
                                                <article
                                                    className={`hour-card forecast-card-${getWeatherType(hourCode)}`}
                                                    key={time}
                                                >
                                                    <WeatherEnvironment
                                                        code={hourCode}
                                                        isDay={hourIsDay}
                                                        className="hour-scene"
                                                    />

                                                    <div className="hour-card-scrim" aria-hidden="true" />

                                                    <div className="hour-card-top">
                                                        <strong>
                                                            {index === 0
                                                                ? "Now"
                                                                : formatHour(time)}
                                                        </strong>
                                                    </div>

                                                    <div className="hour-card-bottom">
                                                        <span className="hour-card-condition">
                                                            {weatherLabel(hourCode)}
                                                        </span>

                                                        <span className="hour-card-temperature">
                                                            {forecast.hourly.temperature_2m?.[index] == null
                                                                ? "--"
                                                                : `${Math.round(forecast.hourly.temperature_2m[index])}°`}
                                                        </span>

                                                        <small>
                                                            <CloudRain size={13} />
                                                            {forecast.hourly.precipitation_probability?.[index] == null
                                                                ? "--"
                                                                : `${Math.round(forecast.hourly.precipitation_probability[index])}% rain`}
                                                        </small>
                                                    </div>
                                                </article>
                                            );
                                        }
                                    )
                                ) : (
                                    <div className="hourly-empty">
                                        {loading
                                            ? "Reading forecast data..."
                                            : "Hourly forecast unavailable for this location."}
                                    </div>
                                )}
                            </div>
                        </section>
                    </div>

                </section>

                <div className="page-content">

                    <div className="container">

                        {error && (
                            <div className="error-panel">

                                <AlertTriangle
                                    size={18}
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
                                        size={15}
                                    />

                                    Retry
                                </button>

                            </div>
                        )}

                        {/* SECONDARY: today's key metrics */}
                        <section>

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
                                    label="Feels Like"
                                    value={weather?.feels_like}
                                    unit={weather?.units?.apparent_temperature || "°C"}
                                />

                                <WeatherCard
                                    icon={Droplets}
                                    label="Humidity"
                                    value={weather?.humidity}
                                    unit={weather?.units?.relative_humidity_2m || "%"}
                                />

                                <WeatherCard
                                    icon={Wind}
                                    label="Wind"
                                    value={weather?.wind_speed}
                                    unit={weather?.units?.wind_speed_10m || "km/h"}
                                />

                                <WeatherCard
                                    icon={Gauge}
                                    label="Pressure"
                                    value={weather?.pressure}
                                    unit={weather?.units?.pressure_msl || "hPa"}
                                />

                                <WeatherCard
                                    icon={Eye}
                                    label="Visibility"
                                    value={weather?.visibility == null
                                        ? null
                                        : Math.round(weather.visibility / 1000)}
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

                        {/* TERTIARY: weekly outlook */}
                        <section className="dashboard-section">

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

                                {daily?.time?.slice(0, 7).map(
                                    (date, index) => (
                                        <ForecastCard
                                            key={date}
                                            date={date}
                                            weatherCode={daily.weather_code?.[index]}
                                            max={daily.temperature_2m_max?.[index]}
                                            min={daily.temperature_2m_min?.[index]}
                                            precipitation={daily.precipitation_probability_max?.[index]}
                                        />
                                    )
                                )}

                            </div>

                        </section>

                        {/* SUPPORTING: risk, alerts, atmosphere, sun times, map, emergency */}
                        <section className="dashboard-section">

                            <div className="section-heading">
                                <div>
                                    <h2>
                                        Weather Risk Assessment
                                    </h2>
                                </div>
                            </div>

                            <RiskCard
                                risk={risk}
                            />

                        </section>

                        <section className="dashboard-section">

                            <div className="alert-panel">

                                <div className="alert-panel-icon">
                                    <AlertTriangle
                                        size={20}
                                    />
                                </div>

                                <div className="alert-panel-content">

                                    <span>
                                        LOCAL WEATHER ALERTS
                                    </span>

                                    <h3>
                                        {alerts == null
                                            ? "Checking official alerts"
                                            : alerts.official_alerts?.length
                                                ? "Official alerts are active"
                                                : "No official alerts available"}
                                    </h3>

                                    <p>
                                        {alerts?.message ||
                                            (alerts == null
                                                ? "Waiting for the connected alert source."
                                                : "There are currently no connected official weather warnings.")}
                                    </p>

                                </div>

                            </div>

                        </section>

                        <section className="dashboard-section">

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
                                    <CloudRain size={18} />
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
                                    <CloudRain size={18} />
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
                                    <Wind size={18} />
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
                                    <Gauge size={18} />
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

                        <section className="dashboard-section">

                            <div className="sun-grid">

                                <div className="sun-card">

                                    <div className="sun-icon">
                                        <Sunrise size={22} />
                                    </div>

                                    <div>
                                        <span>
                                            SUNRISE
                                        </span>

                                        <strong>
                                            {daily?.sunrise?.[0]
                                                ? new Date(daily.sunrise[0]).toLocaleTimeString([], {
                                                    hour: "2-digit",
                                                    minute: "2-digit",
                                                })
                                                : "--"}
                                        </strong>
                                    </div>

                                </div>

                                <div className="sun-card">

                                    <div className="sun-icon">
                                        <Sunset size={22} />
                                    </div>

                                    <div>
                                        <span>
                                            SUNSET
                                        </span>

                                        <strong>
                                            {daily?.sunset?.[0]
                                                ? new Date(daily.sunset[0]).toLocaleTimeString([], {
                                                    hour: "2-digit",
                                                    minute: "2-digit",
                                                })
                                                : "--"}
                                        </strong>
                                    </div>

                                </div>

                            </div>

                        </section>

                        <section className="dashboard-section">

                            <LiveWeatherMap
                                latitude={location?.latitude}
                                longitude={location?.longitude}
                                locationName={locationName}
                                requestLocation={false}
                            />

                        </section>

                        <section className="dashboard-section">

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
                                    <Phone size={18} />
                                    CALL 911
                                </a>

                            </div>

                        </section>

                    </div>

                </div>

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