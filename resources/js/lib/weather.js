export function weatherLabel(code) {
    if (code == null) return "Weather unavailable";
    if (code === 0) return "Clear sky";
    if ([1, 2].includes(code)) return "Partly cloudy";
    if (code === 3) return "Overcast";
    if ([45, 48].includes(code)) return "Fog";
    if ([51, 53, 55, 56, 57].includes(code)) return "Drizzle";
    if ([61, 63, 66].includes(code)) return "Rain";
    if ([65, 67, 80, 81, 82].includes(code)) return "Heavy rain";
    if ([71, 73, 75, 77, 85, 86].includes(code)) return "Snow";
    if ([95, 96, 99].includes(code)) return "Thunderstorm";
    return "Variable weather";
}

export function weatherKind(code) {
    if (code == null) return "cloudy";
    if (code === 0) return "clear";
    if ([1, 2].includes(code)) return "partly";
    if (code === 3) return "cloudy";
    if ([45, 48].includes(code)) return "fog";
    if ([51, 53, 55, 56, 57, 61, 63, 66, 80, 81].includes(code)) return "rain";
    if ([65, 67, 82].includes(code)) return "heavy-rain";
    if ([71, 73, 75, 77, 85, 86].includes(code)) return "snow";
    if ([95, 96, 99].includes(code)) return "storm";
    return "cloudy";
}

export function formatHour(value) {
    if (!value) return "--";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value.slice(11, 16) || "--";
    return date.toLocaleTimeString([], { hour: "numeric" });
}

export function formatTime(value) {
    if (!value) return "--";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value.slice(11, 16) || "--";
    return date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}

export function shortDay(value) {
    if (!value) return "--";
    const date = new Date(`${value}T12:00:00`);
    return date.toLocaleDateString([], { weekday: "short" });
}

export function longDay(value) {
    if (!value) return "--";
    const date = new Date(`${value}T12:00:00`);
    return date.toLocaleDateString([], { weekday: "long", month: "short", day: "numeric" });
}

export function windCompass(degrees) {
    if (degrees == null) return "--";
    const points = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"];
    return points[Math.round((((degrees % 360) + 360) % 360) / 22.5) % 16];
}

export function getCurrentHourIndex(hourly, updatedAt) {
    const target = updatedAt?.slice(0, 13);
    const index = hourly?.time?.findIndex((time) => time.slice(0, 13) === target) ?? -1;
    return Math.max(index, 0);
}

export function getTodayIndex(daily, updatedAt) {
    const date = updatedAt?.slice(0, 10) || new Date().toISOString().slice(0, 10);
    const index = daily?.time?.indexOf(date) ?? -1;
    return Math.max(index, 0);
}

export function weatherGlyph(code) {
    const kind = weatherKind(code);
    return {
        clear: "SUN",
        partly: "SUN / CLOUD",
        cloudy: "CLOUD",
        fog: "FOG",
        rain: "RAIN",
        "heavy-rain": "HEAVY RAIN",
        snow: "SNOW",
        storm: "STORM",
    }[kind] || "CLOUD";
}
