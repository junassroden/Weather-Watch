import {
    useEffect,
    useRef,
    useState,
} from "react";

import {
    TriangleAlert,
    CircleCheck,
    Phone,
    ShieldAlert,
} from "lucide-react";

import Header from "../components/Header";
import RiskCard from "../components/RiskCard";

import {
    getAlerts,
    getRisk,
    reverseLocation,
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

    const [locationName, setLocationName] =
        useState("Current location");

    const locationRequestRef = useRef(0);

    const handleLocationSelect = async (result) => {
        const requestId = ++locationRequestRef.current;
        const latitude = Number(result.latitude);
        const longitude = Number(result.longitude);
        if (!Number.isFinite(latitude) || !Number.isFinite(longitude)
            || latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) {
            setError("That search result does not include a valid location.");
            return;
        }
        setLocationName(result.name);
        setLoading(true);
        setError("");

        const results = await Promise.allSettled([
            getAlerts(latitude, longitude),
            getRisk(latitude, longitude),
        ]);
        if (requestId !== locationRequestRef.current) return;

        const [alertResult, riskResult] = results;
        setAlerts(alertResult.status === "fulfilled" ? alertResult.value : null);
        setRisk(riskResult.status === "fulfilled" ? riskResult.value : null);
        if (alertResult.status === "rejected" && riskResult.status === "rejected") {
            setError("Unable to retrieve safety information for this location.");
        }
        setLoading(false);
    };

    useEffect(() => {
        const requestId = ++locationRequestRef.current;
        if (!navigator.geolocation) {
            setError(
                "Geolocation is not supported."
            );

            setLoading(false);

            return;
        }

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                if (requestId !== locationRequestRef.current) return;
                const latitude =
                    position.coords.latitude;

                const longitude =
                    position.coords.longitude;

                try {
                    const [alertData, riskData, locationData] = await Promise.all([
                        getAlerts(
                            latitude,
                            longitude
                        ),
                        getRisk(
                            latitude,
                            longitude
                        ),
                        reverseLocation(latitude, longitude),
                    ]);

                    if (requestId !== locationRequestRef.current) return;
                    setAlerts(
                        alertData
                    );
                    setRisk(
                        riskData
                    );
                    setLocationName(locationData.city || locationData.locality || "Current location");
                } catch {
                    setError(
                        "Unable to retrieve safety information."
                    );
                } finally {
                    if (requestId === locationRequestRef.current) {
                        setLoading(false);
                    }
                }
            },
            () => {
                if (requestId !== locationRequestRef.current) return;
                setError(
                    "Location permission was denied."
                );

                setLoading(false);
            }
        );
    }, []);

    return (
        <div className="weather-app">

            <Header onLocationSelect={handleLocationSelect} />

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
                            available official alerts for {locationName}.
                        </p>

                    </div>

                    {loading && (
                        <div className="page-loading">
                            Checking local weather safety...
                        </div>
                    )}

                    {error && (
                        <div className="error-panel">
                            <TriangleAlert
                                size={19}
                                strokeWidth={1}
                            />

                            {error}
                        </div>
                    )}

                    {!loading && (
                        <div className="safety-layout">

                            <section className="safety-section safety-primary">

                                <div className="safety-block">
                                    <span className="eyebrow">
                                        RISK ASSESSMENT
                                    </span>

                                    <RiskCard
                                        risk={risk}
                                    />
                                </div>

                                <div className="safety-block">
                                    <span className="eyebrow">
                                        OFFICIAL ALERTS
                                    </span>

                                    <div className="official-alert-panel">

                                        <div className="official-alert-icon">

                                            {alerts?.official_alerts
                                                ?.length ? (
                                                <ShieldAlert
                                                    size={28}
                                                    strokeWidth={1}
                                                />
                                            ) : (
                                                <CircleCheck
                                                    size={28}
                                                    strokeWidth={1}
                                                />
                                            )}

                                        </div>

                                        <div>

                                            <h3>
                                                {alerts == null
                                                    ? "Official warning data unavailable"
                                                    : alerts.official_alerts
                                                        ?.length
                                                        ? "Official warnings detected"
                                                        : "No official warnings available"}
                                            </h3>

                                            <p>
                                                {alerts?.message ||
                                                    (alerts == null
                                                        ? "The connected alert source has not returned data yet."
                                                        : "There are currently no connected official weather warnings.")}
                                            </p>

                                        </div>

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
                                        <Phone size={20} strokeWidth={1} />

                                        CALL 911
                                    </a>

                                </div>
                            </section>

                        </div>
                    )}

                </div>

            </main>

        </div>
    );
}