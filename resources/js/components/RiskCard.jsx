import {
    AlertTriangle,
    ArrowRight,
    ShieldCheck
} from "lucide-react";

function RiskCard() {
    return (
        <div className="risk-card">
            <div className="risk-card-header">
                <div className="risk-icon">
                    <AlertTriangle size={22} />
                </div>

                <div>
                    <span>WEATHERWATCH ASSESSMENT</span>
                    <h3>Weather Risk</h3>
                </div>
            </div>

            <div className="risk-level">
                <ShieldCheck size={19} />
                <strong>MONITORING</strong>
            </div>

            <p>
                WeatherWatch will assess current conditions,
                rainfall, wind, temperature, visibility, and other
                weather factors to determine the current local risk.
            </p>

            <button className="text-button">
                View Risk Details
                <ArrowRight size={17} />
            </button>
        </div>
    );
}

export default RiskCard;