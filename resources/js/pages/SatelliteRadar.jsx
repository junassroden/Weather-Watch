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

function getLocationLabel(location) {
    return (
        location?.locality ||
        location?.city ||
        location?.display_name ||
        "Current location"
    );
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
        const controller = new AbortController();
        let cancelled = false;

        if (!navigator.geolocation) {
            setError("Location access is unavailable.");
            setLoading(false);
            return () => controller.abort();
        }

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                if (cancelled) return;

                const { latitude, longitude } = position.coords;

                setCoordinates({
                    latitude,
                    longitude,
                });

                try {
                    const results = await Promise.allSettled([
                        getCurrentWeather(latitude, longitude, {
                            signal: controller.signal,
                        }),
                        getForecast(latitude, longitude, {
                            signal: controller.signal,
                        }),
                        getRisk(latitude, longitude, {
                            signal: controller.signal,
                        }),
                        reverseLocation(latitude, longitude, {
                            signal: controller.signal,
                        }),
                    ]);

                    if (cancelled) return;

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
                            getLocationLabel(location)
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

        return () => {
            cancelled = true;
            controller.abort();
        };
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

                    <div className="satellite-hero">
                        <WeatherEnvironment
                            code={weather?.weather_code}
                            isDay={weather?.is_day !== 0}
                            className="satellite-hero-scene"
                        />

                        <div className="satellite-hero-scrim" aria-hidden="true" />

                        <div className="page-header satellite-hero-content">
                            <span className="eyebrow">
                                SATELLITE & RADAR
                            </span>

                            <h1>Satellite Weather Intelligence</h1>

                            <p>
                                Read precipitation movement, pressure conditions, and
                                approaching storm signals around your location.
                            </p>
                        </div>

                        <div className="satellite-hero-readout">
                            <span>LOCAL OBSERVATION</span>
                            <strong>{locationName}</strong>
                            <small>
                                {coordinates
                                    ? `${coordinates.latitude.toFixed(4)}, ${coordinates.longitude.toFixed(4)}`
                                    : "Waiting for device location"}
                            </small>
                        </div>
                    </div>

                    <div className="satellite-workspace">
                        <section className="satellite-main-column">
                            <LiveWeatherMap
                                latitude={coordinates?.latitude}
                                longitude={coordinates?.longitude}
                                locationName={locationName}
                                requestLocation={false}
                                onRadarLoaded={handleRadarLoaded}
                                onRadarError={handleRadarError}
                            />

                            {radar && (
                                <div className="radar-information">
                                    <div className="radar-info-line">
                                        <Radar size={19} />
                                        <span>PROVIDER</span>
                                        <strong>{radar.provider}</strong>
                                    </div>

                                    <div className="radar-info-line">
                                        <Database size={19} />
                                        <span>AVAILABLE FRAMES</span>
                                        <strong>{radar.frames?.length || 0}</strong>
                                    </div>

                                    <div className="radar-info-line">
                                        <Satellite size={19} />
                                        <span>DATA TYPE</span>
                                        <strong>Past Radar</strong>
                                    </div>
                                </div>
                            )}

                            <div className="data-source-note">
                                Radar data is provided by RainViewer. The satellite-style map background is provided separately by Esri World Imagery.
                            </div>
                        </section>

                        <aside className="satellite-side-column">
                            <section className="satellite-intelligence">
                                <div className="satellite-section-heading">
                                    <span className="eyebrow">FIELD INTELLIGENCE</span>
                                    <h2>Conditions around {locationName}</h2>
                                </div>

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

                                <div className="satellite-reading-list">
                                    <div className="satellite-reading-row">
                                        <div className="satellite-reading-label">
                                            <Gauge size={18} />
                                            <span>PRESSURE FIELD</span>
                                        </div>
                                        <div className="satellite-reading-value">
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
                                    </div>

                                    <div className="satellite-reading-row">
                                        <div className="satellite-reading-label">
                                            <Droplets size={18} />
                                            <span>PRECIPITATION OUTLOOK</span>
                                        </div>
                                        <div className="satellite-reading-value">
                                            <strong>{Math.max(...(forecast?.daily?.precipitation_probability_max || []), 0)}</strong>
                                            <span>% peak chance</span>
                                        </div>
                                        <p>{weatherDescription(nextDayCode ?? weather?.weather_code)} · {nextDay || "Next available forecast"}</p>
                                    </div>

                                    <div className="satellite-reading-row">
                                        <div className="satellite-reading-label">
                                            <Wind size={18} />
                                            <span>HAZARD INDEX</span>
                                        </div>
                                        <div className="satellite-reading-value">
                                            <strong>{risk?.level || "--"}</strong>
                                            <span>{risk ? `score ${risk.score}` : "pending"}</span>
                                        </div>
                                        <p>{risk?.reasons?.[0] || "Calculating local weather risk."}</p>
                                    </div>
                                </div>
                            </section>

                            <div className="satellite-status-region" aria-live="polite">
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
                            </div>
                        </aside>
                    </div>

                </div>

            </main>

        </div>
    );
}