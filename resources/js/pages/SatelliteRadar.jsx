import {
    useEffect,
    useState,
} from "react";

import {
    Database,
    Radar,
    Satellite,
} from "lucide-react";

import Header from "../components/Header";
import LiveWeatherMap from "../components/LiveWeatherMap";

import { getRadarFrames } from "../services/api";

export default function SatelliteRadar() {
    const [radar, setRadar] =
        useState(null);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

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

    return (
        <div className="weather-app">

            <Header />

            <main className="page-content">

                <div className="container">

                    <div className="page-header">

                        <span className="eyebrow">
                            SATELLITE & RADAR
                        </span>

                        <h1>
                            Weather Radar Monitoring
                        </h1>

                        <p>
                            Monitor precipitation radar
                            movement around your location.
                        </p>

                    </div>

                    <LiveWeatherMap />

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