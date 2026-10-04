import AppHeader from "../components/AppHeader";
import useWeather from "../hooks/useWeather";
import { AlertTriangle, CheckCircle2, Clock3, MapPin, ShieldCheck } from "lucide-react";

function severityFromRisk(level = "LOW") {
    return { LOW: "advisory", MODERATE: "watch", HIGH: "warning", SEVERE: "severe" }[level] || "advisory";
}

export default function AlertsSafety() {
    const state = useWeather();
    const { locationName, locationDetail, risk, alerts, loading, selectLocation, useCurrentLocation } = state;
    const official = alerts?.official_alerts || [];
    const level = risk?.level || "LOW";

    return (
        <div className="ww-app-shell">
            <AppHeader onLocationSelect={selectLocation} onUseLocation={useCurrentLocation} />
            <main className="ww-main ww-alerts-page">
                <section className="ww-alerts-hero">
                    <div><span className="ww-eyebrow">ALERTS / SAFETY</span><h1>Know the risk before it reaches you.</h1><p>Local risk signals from forecast conditions plus any connected official warning sources for {locationName}.</p></div>
                    <div className={`ww-risk-orb risk-${severityFromRisk(level)}`}><ShieldCheck size={42} strokeWidth={1.2} /><span>{loading ? "CHECKING" : level}</span><small>current risk</small></div>
                </section>

                <section className="ww-alert-stream">
                    <div className="ww-alert-stream-heading"><span className="ww-eyebrow">CURRENT STATUS</span><h2>{official.length ? `${official.length} official warning${official.length > 1 ? "s" : ""}` : "No connected official warning"}</h2></div>
                    {official.length ? official.map((alert, index) => (
                        <article className="ww-alert-record is-warning" key={alert.id || index}>
                            <AlertTriangle size={24} strokeWidth={1.4} />
                            <div><span>OFFICIAL WARNING</span><h3>{alert.event || alert.title || "Weather warning"}</h3><p>{alert.description || alert.message || "Review official guidance for your area."}</p><div className="ww-alert-meta"><span><MapPin size={14} /> {locationName}</span><span><Clock3 size={14} /> {alert.start || "Active now"}</span></div></div>
                        </article>
                    )) : (
                        <article className="ww-alert-record is-clear">
                            <CheckCircle2 size={26} strokeWidth={1.4} />
                            <div><span>OFFICIAL SOURCE STATUS</span><h3>No official warnings returned</h3><p>{alerts?.message || "The current alert connection has not returned an active official warning for this location."}</p><div className="ww-alert-meta"><span><MapPin size={14} /> {locationName}{locationDetail ? ` · ${locationDetail}` : ""}</span></div></div>
                        </article>
                    )}

                    <article className={`ww-alert-record risk-record risk-${severityFromRisk(level)}`}>
                        <AlertTriangle size={24} strokeWidth={1.4} />
                        <div><span>WEATHER WATCH RISK MODEL</span><h3>{level} local weather risk</h3><p>{risk?.reasons?.length ? risk.reasons.join(" ") : "No significant risk indicators are present in the available weather data."}</p><div className="ww-alert-meta"><span>Risk score {risk?.score ?? 0}</span><span>Forecast-derived, not an official warning</span></div></div>
                    </article>
                </section>
            </main>
        </div>
    );
}
