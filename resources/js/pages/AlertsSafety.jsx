import {
    useEffect,
    useState,
} from "react";

import {
    AlertTriangle,
    CheckCircle,
    Phone,
    ShieldAlert,
} from "lucide-react";

import Header from "../components/Header";
import RiskCard from "../components/RiskCard";

import {
    getAlerts,
    getRisk,
} from "../services/api";

export default function AlertsSafety() {
    const [alerts, setAlerts] =
        useState(null);

    const [risk, setRisk] =
        useState(null);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    useEffect(() => {
        if (!navigator.geolocation) {
            setError(
                "Geolocation is not supported."
            );

            setLoading(false);

            return;
        }

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const latitude =
                    position.coords.latitude;

                const longitude =
                    position.coords.longitude;

                try {
                    const [
                        alertData,
                        riskData,
                    ] = await Promise.all([
                        getAlerts(
                            latitude,
                            longitude
                        ),
                        getRisk(
                            latitude,
                            longitude
                        ),
                    ]);

                    setAlerts(
                        alertData
                    );

                    setRisk(
                        riskData
                    );
                } catch {
                    setError(
                        "Unable to retrieve safety information."
                    );
                } finally {
                    setLoading(false);
                }
            },
            () => {
                setError(
                    "Location permission was denied."
                );

                setLoading(false);
            }
        );
    }, []);

    return (
        <div className="weather-app">

            <Header />

            <main className="page-content">

                <div className="container">

                    <div className="page-header">

                        <span className="eyebrow">
                            ALERTS & SAFETY
                        </span>

                        <h1>
                            Weather Alerts & Safety
                        </h1>

                        <p>
                            Monitor weather risks and
                            available official alerts
                            for your location.
                        </p>

                    </div>

                    {loading && (
                        <div className="page-loading">
                            Checking local weather safety...
                        </div>
                    )}

                    {error && (
                        <div className="error-panel">
                            <AlertTriangle
                                size={19}
                            />

                            {error}
                        </div>
                    )}

                    {!loading && (
                        <>
                            <section className="safety-section">

                                <div className="section-heading">

                                    <div>
                                        <span className="eyebrow">
                                            RISK ASSESSMENT
                                        </span>

                                        <h2>
                                            Current Weather Risk
                                        </h2>
                                    </div>

                                </div>

                                <RiskCard
                                    risk={risk}
                                />

                            </section>

                            <section className="safety-section">

                                <div className="section-heading">

                                    <div>
                                        <span className="eyebrow">
                                            OFFICIAL ALERTS
                                        </span>

                                        <h2>
                                            Local Warnings
                                        </h2>
                                    </div>

                                </div>

                                <div className="official-alert-panel">

                                    <div className="official-alert-icon">

                                        {alerts?.official_alerts
                                            ?.length ? (
                                            <ShieldAlert
                                                size={28}
                                            />
                                        ) : (
                                            <CheckCircle
                                                size={28}
                                            />
                                        )}

                                    </div>

                                    <div>

                                        <h3>
                                            {alerts?.official_alerts
                                                ?.length
                                                ? "Official warnings detected"
                                                : "No official warnings available"}
                                        </h3>

                                        <p>
                                            {alerts?.message ||
                                                "There are currently no connected official weather warnings."}
                                        </p>

                                    </div>

                                </div>

                            </section>

                            <section className="safety-section">

                                <div className="emergency-panel">

                                    <div>

                                        <span>
                                            EMERGENCY
                                        </span>

                                        <h2>
                                            Need immediate help?
                                        </h2>

                                        <p>
                                            For emergencies
                                            in the Philippines,
                                            call the national
                                            emergency hotline.
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
                        </>
                    )}

                </div>

            </main>

        </div>
    );
}