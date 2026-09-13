import {
    useCallback,
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
import WeatherEnvironment from "../components/WeatherEnvironment";

import {
    getCurrentWeather,
    getForecast,
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

function stormWatchCode(tone) {
    if (tone === "severe") return 96;
    if (tone === "watch") return 63;
    return 1;
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

    const [coordinates, setCoordinates] =
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

    const handleRadarLoaded = useCallback((data) => {
        setRadar(data);
    }, []);

    const handleRadarError = useCallback(() => {
        // LiveWeatherMap already renders its own radar-specific error
        // and retry UI inside the map card. Nothing further is needed
        // here — and critically, this must NOT touch the page-level
        // `error`/`loading` state below: those track this page's own
        // weather/forecast/risk fetch, which is a completely separate
        // network request from the map's radar-frame fetch. Wiring them
        // together previously meant a slow-but-successful radar fetch
        // could leave "Loading radar information..." on screen long
        // after the page's own data had already arrived (or disappear
        // before it had), and a radar failure could silently overwrite
        // a meaningful "location permission denied" message with a
        // generic one, or vice versa depending on which request
        // happened to resolve last.
    }, []);

    useEffect(() => {
        if (!navigator.geolocation) {
            setError("Location access is unavailable.");
            setLoading(false);
            return;
        }

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;

                setCoordinates({
                    latitude,
                    longitude,
                });

                try {
                    const results = await Promise.allSettled([
                        getCurrentWeather(latitude, longitude),
                        getForecast(latitude, longitude),
                        getRisk(latitude, longitude),
                        reverseLocation(latitude, longitude),
                    ]);

                    const [weatherResult, forecastResult, riskResult, locationResult] = results;

                    if (weatherResult.status === "fulfilled") {
                        setWeather(weatherResult.value);
                    }

                    if (forecastResult.status === "fulfilled") {
                        setForecast(forecastResult.value);
                    }

                    if (riskResult.status === "fulfilled") {
                        setRisk(riskResult.value);
                    }

                    if (locationResult.status === "fulfilled") {
                        const location = locationResult.value;

                        setLocationName(
                            location.city || location.display_name || "Current location"
                        );
                    }

                    if (results.every((result) => result.status === "rejected")) {
                        setError("Weather telemetry is temporarily unavailable.");
                    }
                } finally {
                    // This always fires — on full success, partial
                    // success, or total failure — so the loading state
                    // for this page's own data can never hang forever.
                    setLoading(false);
                }
            },
            () => {
                setError("Allow location access to view local satellite telemetry.");
                setLoading(false);
            },
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

                    <LiveWeatherMap
                        latitude={coordinates?.latitude}
                        longitude={coordinates?.longitude}
                        locationName={locationName}
                        requestLocation={false}
                        onRadarLoaded={handleRadarLoaded}
                        onRadarError={handleRadarError}
                    />

                    <section className="satellite-command-grid">

                        <article className={`satellite-alert satellite-alert-${stormWatch.tone}`}>
                            <WeatherEnvironment
                                code={stormWatchCode(stormWatch.tone)}
                                isDay={true}
                                className="satellite-alert-scene"
                            />

                            <div className="satellite-alert-scrim" aria-hidden="true" />

                            <div className="satellite-alert-content">
                                <div className="satellite-panel-heading">
                                    <CloudLightning size={20} />
                                    <span>STORM WATCH</span>
                                </div>
                                <strong>{stormWatch.level}</strong>
                                <p>{stormWatch.detail}</p>
                                <small>Based on the seven-day Open-Meteo outlook</small>
                            </div>
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
                            Loading local weather telemetry...
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