import {
    useEffect,
    useState,
} from "react";

import {
    Database,
    Gauge,
    CloudLightning,
    Droplets,
    Wind,
    Radar,
    Satellite,
} from "lucide-react";

import Header from "../components/Header";
import LiveWeatherMap from "../components/LiveWeatherMap";

import {
    getCurrentWeather,
    getForecast,
    getRadarFrames,
    getRisk,
    reverseLocation,
} from "../services/api";

function weatherDescription(code) {
    if (code >= 95) {
        return "Thunderstorm activity";
    }

    if (code >= 80) {
        return "Rain showers";
    }

    if (code >= 51) {
        return "Rain in the forecast";
    }

    if (code >= 1) {
        return "Cloud development";
    }

    return "Clear conditions";
}

function getStormWatch(forecast) {
    const daily = forecast?.daily || {};
    const codes = daily.weather_code || [];
    const rain = daily.precipitation_probability_max || [];
    const gusts = daily.wind_gusts_10m_max || [];
    const stormIndex = codes.findIndex((code) => code >= 95);
    const heavyRainIndex = rain.findIndex((chance) => chance >= 70);
    const strongestGust = Math.max(...gusts, 0);

    if (stormIndex >= 0) {
        return {
            level: "STORM SIGNAL",
            detail: `Thunderstorm conditions possible on ${daily.time?.[stormIndex] || "the forecast period"}.`,
            tone: "severe",
        };
    }

    if (heavyRainIndex >= 0 || strongestGust >= 45) {
        return {
            level: "ACTIVE WEATHER",
            detail: `Rain probability reaches ${Math.max(...rain, 0)}% with gusts up to ${strongestGust} km/h.`,
            tone: "watch",
        };
    }

    return {
        level: "NO STORM SIGNAL",
        detail: "No thunderstorm codes or strong-wind event detected in the available outlook.",
        tone: "clear",
    };
}

export default function SatelliteRadar() {
    const [radar, setRadar] =
        useState(null);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    const [weather, setWeather] =
        useState(null);

    const [forecast, setForecast] =
        useState(null);

    const [risk, setRisk] =
        useState(null);

    const [locationName, setLocationName] =
        useState("Current location");

    useEffect(() => {
        getRadarFrames()
            .then((data) => {
                setRadar(data);
            })
            .catch(() => {
                setError(
                    "Unable to load radar information."
                );
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    useEffect(() => {
        if (!navigator.geolocation) {
            setError("Location access is unavailable.");
            return;
        }

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;

                try {
                    const [weatherData, forecastData, riskData, location] =
                        await Promise.all([
                            getCurrentWeather(latitude, longitude),
                            getForecast(latitude, longitude),
                            getRisk(latitude, longitude),
                            reverseLocation(latitude, longitude),
                        ]);

                    setWeather(weatherData);
                    setForecast(forecastData);
                    setRisk(riskData);
                    setLocationName(
                        location.city || location.display_name || "Current location"
                    );
                } catch {
                    setError("Weather telemetry is temporarily unavailable.");
                }
            },
            () => setError("Allow location access to view local satellite telemetry."),
            { enableHighAccuracy: true, timeout: 10000, maximumAge: 300000 }
        );
    }, []);

    const stormWatch = getStormWatch(forecast);
    const pressure = weather?.pressure;
    const nextDay = forecast?.daily?.time?.[1];
    const nextDayCode = forecast?.daily?.weather_code?.[1];

    return (
        <div className="weather-app">

            <Header />

            <main className="page-content">

                <div className="container">

                    <div className="page-header">

                        <span className="eyebrow">
                            SATELLITE & RADAR
                        </span>

                        <h1>Satellite Weather Intelligence</h1>

                        <p>
                            Read precipitation movement, pressure conditions, and
                            approaching storm signals around your location.
                        </p>

                    </div>

                    <LiveWeatherMap />

                    <section className="satellite-command-grid">

                        <article className={`satellite-alert satellite-alert-${stormWatch.tone}`}>
                            <div className="satellite-panel-heading">
                                <CloudLightning size={20} />
                                <span>STORM WATCH</span>
                            </div>
                            <strong>{stormWatch.level}</strong>
                            <p>{stormWatch.detail}</p>
                            <small>Based on the seven-day Open-Meteo outlook</small>
                        </article>

                        <article className="satellite-panel">
                            <div className="satellite-panel-heading">
                                <Gauge size={20} />
                                <span>PRESSURE FIELD</span>
                            </div>
                            <div className="satellite-reading">
                                <strong>{pressure ?? "--"}</strong>
                                <span>hPa</span>
                            </div>
                            <p>
                                {pressure >= 1020
                                    ? "Higher pressure, generally more stable air."
                                    : pressure <= 1000
                                        ? "Lower pressure, monitor for unsettled weather."
                                        : "Mid-range pressure with changing conditions possible."}
                            </p>
                            <small>{locationName} atmospheric reading</small>
                        </article>

                        <article className="satellite-panel">
                            <div className="satellite-panel-heading">
                                <Droplets size={20} />
                                <span>PRECIPITATION OUTLOOK</span>
                            </div>
                            <div className="satellite-reading">
                                <strong>{Math.max(...(forecast?.daily?.precipitation_probability_max || []), 0)}</strong>
                                <span>% peak chance</span>
                            </div>
                            <p>{weatherDescription(nextDayCode ?? weather?.weather_code)}</p>
                            <small>{nextDay || "Next available forecast"}</small>
                        </article>

                        <article className="satellite-panel">
                            <div className="satellite-panel-heading">
                                <Wind size={20} />
                                <span>HAZARD INDEX</span>
                            </div>
                            <div className="satellite-reading">
                                <strong>{risk?.level || "--"}</strong>
                                <span>{risk ? `score ${risk.score}` : "pending"}</span>
                            </div>
                            <p>{risk?.reasons?.[0] || "Calculating local weather risk."}</p>
                            <small>WeatherWatch assessment</small>
                        </article>

                    </section>

                    {loading && (
                        <div className="page-loading">
                            Loading radar information...
                        </div>
                    )}

                    {error && (
                        <div className="error-panel">
                            {error}
                        </div>
                    )}

                    {radar && (
                        <div className="radar-information">

                            <div className="radar-info-card">

                                <Radar size={22} />

                                <span>
                                    PROVIDER
                                </span>

                                <strong>
                                    {radar.provider}
                                </strong>

                            </div>

                            <div className="radar-info-card">

                                <Database size={22} />

                                <span>
                                    AVAILABLE FRAMES
                                </span>

                                <strong>
                                    {radar.frames?.length || 0}
                                </strong>

                            </div>

                            <div className="radar-info-card">

                                <Satellite size={22} />

                                <span>
                                    DATA TYPE
                                </span>

                                <strong>
                                    Past Radar
                                </strong>

                            </div>

                        </div>
                    )}

                    <div className="data-source-note">

                        Radar data is provided by RainViewer.
                        The satellite-style map background
                        is provided separately by Esri World
                        Imagery.

                    </div>

                </div>

            </main>

        </div>
    );
}