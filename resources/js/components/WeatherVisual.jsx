import {
    Sun,
    Moon,
    CloudSun,
    CloudMoon,
    Cloud,
    CloudFog,
    CloudDrizzle,
    CloudRain,
    CloudRainWind,
    CloudSnow,
    CloudLightning,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/* Weather-type classification. This is the single source of truth    */
/* every visual in the app (atmospheric scenes, icons, accent colors) */
/* derives from, so a given Open-Meteo code always looks the same     */
/* everywhere it appears.                                             */
/* ------------------------------------------------------------------ */

export function getWeatherType(code) {
    if (code === null || code === undefined) {
        return "unknown";
    }

    if (code === 0) {
        return "clear";
    }

    if (code === 1 || code === 2) {
        return "partly";
    }

    if (code === 3) {
        return "overcast";
    }

    if (code === 45 || code === 48) {
        return "fog";
    }

    if (code >= 51 && code <= 57) {
        return "drizzle";
    }

    if (code >= 61 && code <= 67) {
        return "rain";
    }

    if (code >= 71 && code <= 77) {
        return "snow";
    }

    if (code >= 80 && code <= 82) {
        return "showers";
    }

    if (code >= 95) {
        return "storm";
    }

    return "overcast";
}

export function weatherLabel(code) {
    if (code === null || code === undefined) {
        return "Waiting for conditions";
    }

    if (code === 0) {
        return "Clear sky";
    }

    if (code === 1) {
        return "Mainly clear";
    }

    if (code === 2) {
        return "Partly cloudy";
    }

    if (code === 3) {
        return "Overcast";
    }

    if (code === 45 || code === 48) {
        return "Fog";
    }

    if (code >= 51 && code <= 55) {
        return "Drizzle";
    }

    if (code >= 56 && code <= 57) {
        return "Freezing drizzle";
    }

    if (code >= 61 && code <= 65) {
        return "Rain";
    }

    if (code >= 66 && code <= 67) {
        return "Freezing rain";
    }

    if (code >= 71 && code <= 77) {
        return "Snow";
    }

    if (code >= 80 && code <= 82) {
        return "Rain showers";
    }

    if (code === 95) {
        return "Thunderstorm";
    }

    if (code === 96 || code === 99) {
        return "Thunderstorm with hail";
    }

    return "Variable conditions";
}

/* ------------------------------------------------------------------ */
/* Weather icon system. One icon family (lucide), one stroke weight    */
/* (set globally in app.css), one glyph per weather state — used as a  */
/* small supporting mark alongside the atmospheric scene, never as the */
/* dominant element on a card.                                         */
/* ------------------------------------------------------------------ */

const ICONS = {
    clear: { day: Sun, night: Moon },
    partly: { day: CloudSun, night: CloudMoon },
    overcast: { day: Cloud, night: Cloud },
    fog: { day: CloudFog, night: CloudFog },
    drizzle: { day: CloudDrizzle, night: CloudDrizzle },
    rain: { day: CloudRain, night: CloudRain },
    showers: { day: CloudRainWind, night: CloudRainWind },
    snow: { day: CloudSnow, night: CloudSnow },
    storm: { day: CloudLightning, night: CloudLightning },
    unknown: { day: Cloud, night: Cloud },
};

export function weatherIconComponent(code, isDay = true) {
    const type = getWeatherType(code);
    const pair = ICONS[type] || ICONS.unknown;
    return isDay ? pair.day : pair.night;
}

export default function WeatherIcon({
    code,
    isDay = true,
    size = 18,
    className = "",
}) {
    const Icon = weatherIconComponent(code, isDay);

    return (
        <Icon
            size={size}
            className={`weather-icon ${className}`}
            aria-hidden="true"
        />
    );
}