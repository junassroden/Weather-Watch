import {
    AlertTriangle,
    ShieldCheck,
} from "lucide-react";

export default function RiskCard({
    risk,
}) {
    const available = Boolean(risk);

    const level =
        available
            ? risk.level
            : "UNAVAILABLE";

    const message =
        available
            ? risk.message ||
              "No significant weather risk detected."
            : "Risk assessment is not available yet.";

    const recommendation =
        available
            ? risk.recommendation ||
              "Continue monitoring local weather conditions."
            : "Try again when local weather data is available.";

    const severe =
        level === "HIGH" ||
        level === "SEVERE";

    return (
        <article
            className={`risk-card glass-panel risk-${level.toLowerCase()}`}
        >

            <div className="risk-header">

                <div>
                    <span className="eyebrow">
                        WEATHER RISK
                    </span>

                    <h3>
                        Current Assessment
                    </h3>
                </div>

                <div className="risk-icon">
                    {severe ? (
                        <AlertTriangle
                            size={20}
                        />
                    ) : (
                        <ShieldCheck
                            size={20}
                        />
                    )}
                </div>

            </div>

            <div className="risk-status">

                <span className="risk-indicator" />

                <strong>
                    {level}
                </strong>

            </div>

            <p className="risk-message">
                {message}
            </p>

            <div className="risk-recommendation">
                <span>
                    Recommended
                </span>

                <p>
                    {recommendation}
                </p>
            </div>

            <small className="risk-disclaimer">
                Application-generated weather
                assessment. Not an official
                emergency warning.
            </small>

        </article>
    );
}