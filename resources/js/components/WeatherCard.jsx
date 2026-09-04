export default function WeatherCard({
    icon: Icon,
    label,
    value,
    unit = "",
    description = "",
}) {
    return (
        <div className="weather-card">

            <div className="weather-card-icon">
                <Icon size={21} />
            </div>

            <div className="weather-card-content">

                <span className="weather-card-label">
                    {label}
                </span>

                <div className="weather-card-value">
                    {value ?? "--"}

                    {unit && (
                        <span>
                            {unit}
                        </span>
                    )}
                </div>

                {description && (
                    <span className="weather-card-description">
                        {description}
                    </span>
                )}

            </div>

        </div>
    );
};