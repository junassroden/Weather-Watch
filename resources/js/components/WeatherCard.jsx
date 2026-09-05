export default function WeatherCard({
    icon: Icon,
    label,
    value,
    unit = "",
    description = "",
}) {
    const isAvailable = value !== null && value !== undefined;

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
                    {isAvailable ? value : "Unavailable"}

                    {isAvailable && unit && (
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