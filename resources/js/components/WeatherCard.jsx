export default function WeatherCard({
    icon: Icon,
    label,
    value,
    unit = "",
    description = "",
}) {
    const available =
        value !== null &&
        value !== undefined;

    return (
        <article className="weather-card">

            <div className="weather-card-header">

                <span className="weather-card-icon">
                    <Icon
                        size={18}
                        strokeWidth={1.8}
                    />
                </span>

                <span className="weather-card-label">
                    {label}
                </span>

            </div>

            <div className="weather-card-value">

                {available
                    ? value
                    : "—"}

                {available && unit && (
                    <small>
                        {unit}
                    </small>
                )}

            </div>

            {description && (
                <div className="weather-card-description">
                    {description}
                </div>
            )}

        </article>
    );
}