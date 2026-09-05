import {
    AlertTriangle,
    ShieldCheck,
} from "lucide-react";

export default function RiskCard({
    risk,
}) {
    const level =
        risk?.level ||
        "LOW";

    const message =
        risk?.message ||
        "No significant weather risk detected.";

    const recommendation =
        risk?.recommendation ||
        "Continue monitoring local weather conditions.";

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