function ForecastCard({
    day,
    date,
    icon,
    condition,
    high,
    low,
    rain
}) {
    return (
        <div className="forecast-card">
            <div className="forecast-top">
                <div>
                    <strong>{day}</strong>
                    <span>{date}</span>
                </div>

                <div className="forecast-icon">
                    {icon}
                </div>
            </div>

            <div className="forecast-condition">
                {condition}
            </div>

            <div className="forecast-temperature">
                <strong>{high}</strong>
                <span>{low}</span>
            </div>

            <div className="forecast-rain">
                <span>Rain</span>
                <strong>{rain}</strong>
            </div>
        </div>
    );
}

export default ForecastCard;