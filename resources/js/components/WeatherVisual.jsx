const WEATHER_TYPES = {
    clear: "clear",
    partly: "partly",
    cloudy: "cloudy",
    fog: "fog",
    drizzle: "drizzle",
    rain: "rain",
    snow: "snow",
    storm: "storm",
};

export function getWeatherType(weatherCode) {
    if (weatherCode === 0) {
        return WEATHER_TYPES.clear;
    }

    if (weatherCode === 1 || weatherCode === 2) {
        return WEATHER_TYPES.partly;
    }

    if (weatherCode === 3) {
        return WEATHER_TYPES.cloudy;
    }

    if (weatherCode === 45 || weatherCode === 48) {
        return WEATHER_TYPES.fog;
    }

    if (weatherCode >= 51 && weatherCode <= 55) {
        return WEATHER_TYPES.drizzle;
    }

    if ((weatherCode >= 56 && weatherCode <= 67) || (weatherCode >= 80 && weatherCode <= 82)) {
        return WEATHER_TYPES.rain;
    }

    if (weatherCode >= 71 && weatherCode <= 77) {
        return WEATHER_TYPES.snow;
    }

    if (weatherCode >= 95) {
        return WEATHER_TYPES.storm;
    }

    return WEATHER_TYPES.cloudy;
}

export function getWeatherLabel(weatherCode) {
    const labels = {
        0: "Clear sky",
        1: "Mainly clear",
        2: "Partly cloudy",
        3: "Overcast",
        45: "Fog",
        48: "Freezing fog",
        51: "Light drizzle",
        53: "Drizzle",
        55: "Dense drizzle",
        56: "Freezing drizzle",
        57: "Dense freezing drizzle",
        61: "Light rain",
        63: "Rain",
        65: "Heavy rain",
        66: "Freezing rain",
        67: "Heavy freezing rain",
        71: "Light snow",
        73: "Snow",
        75: "Heavy snow",
        77: "Snow grains",
        80: "Light showers",
        81: "Rain showers",
        82: "Heavy showers",
        95: "Thunderstorm",
        96: "Thunderstorm with hail",
        99: "Thunderstorm with heavy hail",
    };

    return labels[weatherCode] || "Variable conditions";
}

export default function WeatherVisual({
    weatherCode,
    isDay = true,
    size = "medium",
}) {
    const type = getWeatherType(weatherCode);
    const isNight = !isDay;

    return (
        <div
            className={`weather-visual weather-visual-${type} weather-visual-${size} ${isNight ? "weather-visual-night" : ""}`}
            role="img"
            aria-label={getWeatherLabel(weatherCode)}
        >
            {(type === WEATHER_TYPES.clear || type === WEATHER_TYPES.partly) && (
                <span className="weather-visual-orb" />
            )}

            {isNight && type === WEATHER_TYPES.clear && (
                <span className="weather-visual-stars" />
            )}

            {[
                WEATHER_TYPES.partly,
                WEATHER_TYPES.cloudy,
                WEATHER_TYPES.fog,
                WEATHER_TYPES.drizzle,
                WEATHER_TYPES.rain,
                WEATHER_TYPES.snow,
                WEATHER_TYPES.storm,
            ].includes(type) && (
                <span className="weather-visual-cloud">
                    <i />
                    <b />
                    <em />
                </span>
            )}

            {(type === WEATHER_TYPES.drizzle || type === WEATHER_TYPES.rain || type === WEATHER_TYPES.storm) && (
                <span className="weather-visual-precipitation" />
            )}

            {type === WEATHER_TYPES.snow && (
                <span className="weather-visual-snow" />
            )}

            {type === WEATHER_TYPES.storm && (
                <span className="weather-visual-lightning" />
            )}

            {type === WEATHER_TYPES.fog && (
                <span className="weather-visual-mist" />
            )}
        </div>
    );
}