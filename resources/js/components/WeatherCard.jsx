function WeatherCard({
    icon,
    label,
    value,
    description
}) {
    return (
        <div className="weather-card">
            <div className="weather-card-icon">
                {icon}
            </div>

            <div className="weather-card-content">
                <span className="weather-card-label">
                    {label}
                </span>

                <strong className="weather-card-value">
                    {value}
                </strong>

                <span className="weather-card-description">
                    {description}
                </span>
            </div>
        </div>
    );
}

export default WeatherCard;