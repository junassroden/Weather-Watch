import {
    Cloud,
    CloudFog,
    CloudLightning,
    Snowflake,
} from "lucide-react";

export function getWeatherType(code) {
    if (code === 0) {
        return "clear";
    }

    if (
        code === 1 ||
        code === 2
    ) {
        return "partly";
    }

    if (code === 3) {
        return "overcast";
    }

    if (
        code === 45 ||
        code === 48
    ) {
        return "fog";
    }

    if (
        code >= 51 &&
        code <= 57
    ) {
        return "drizzle";
    }

    if (
        code >= 61 &&
        code <= 67
    ) {
        return "rain";
    }

    if (
        code >= 71 &&
        code <= 77
    ) {
        return "snow";
    }

    if (
        code >= 80 &&
        code <= 82
    ) {
        return "showers";
    }

    if (code >= 95) {
        return "storm";
    }

    return "overcast";
}

export function weatherLabel(code) {
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

    if (
        code === 45 ||
        code === 48
    ) {
        return "Fog";
    }

    if (
        code >= 51 &&
        code <= 55
    ) {
        return "Drizzle";
    }

    if (
        code >= 56 &&
        code <= 57
    ) {
        return "Freezing drizzle";
    }

    if (
        code >= 61 &&
        code <= 65
    ) {
        return "Rain";
    }

    if (
        code >= 66 &&
        code <= 67
    ) {
        return "Freezing rain";
    }

    if (
        code >= 71 &&
        code <= 77
    ) {
        return "Snow";
    }

    if (
        code >= 80 &&
        code <= 82
    ) {
        return "Rain showers";
    }

    if (code === 95) {
        return "Thunderstorm";
    }

    if (
        code === 96 ||
        code === 99
    ) {
        return "Thunderstorm with hail";
    }

    return "Variable conditions";
}

function SunVisual({
    night = false,
}) {
    if (night) {
        return (
            <div className="visual-moon">
                <div className="moon-body" />
                <span className="moon-shadow moon-shadow-one" />
                <span className="moon-shadow moon-shadow-two" />
            </div>
        );
    }

    return (
        <div className="visual-sun">
            <div className="sun-glow" />
            <div className="sun-core" />

            <div className="sun-rays">
                {Array.from({
                    length: 8,
                }).map((_, index) => (
                    <span
                        key={index}
                        style={{
                            transform: `rotate(${index * 45}deg)`,
                        }}
                    />
                ))}
            </div>
        </div>
    );
}

function CloudVisual({
    dark = false,
}) {
    return (
        <div
            className={`visual-cloud ${
                dark
                    ? "visual-cloud-dark"
                    : ""
            }`}
        >
            <span className="cloud-one" />
            <span className="cloud-two" />
            <span className="cloud-three" />
        </div>
    );
}

function RainVisual({
    heavy = false,
}) {
    const count = heavy ? 12 : 8;

    return (
        <div className="visual-rain">
            <CloudVisual dark />

            <div className="rain-lines">
                {Array.from({
                    length: count,
                }).map((_, index) => (
                    <span
                        key={index}
                        style={{
                            left: `${8 + index * 8}%`,
                            animationDelay: `${
                                (index % 4) * 0.18
                            }s`,
                        }}
                    />
                ))}
            </div>
        </div>
    );
}

function StormVisual() {
    return (
        <div className="visual-storm">
            <CloudVisual dark />

            <svg
                className="storm-bolt"
                viewBox="0 0 80 110"
                aria-hidden="true"
            >
                <path
                    d="M47 2 L16 60 H38 L28 108 L66 46 H44 Z"
                />
            </svg>

            <div className="storm-rain">
                {Array.from({
                    length: 6,
                }).map((_, index) => (
                    <span
                        key={index}
                        style={{
                            left: `${12 + index * 13}%`,
                        }}
                    />
                ))}
            </div>
        </div>
    );
}

function FogVisual() {
    return (
        <div className="visual-fog">
            <CloudFog
                size={58}
                strokeWidth={1}
            />

            <span />
            <span />
            <span />
        </div>
    );
}

function SnowVisual() {
    return (
        <div className="visual-snow">
            <CloudVisual dark />

            <div className="snowflakes">
                {Array.from({
                    length: 8,
                }).map((_, index) => (
                    <span key={index}>
                        <Snowflake size={11} />
                    </span>
                ))}
            </div>
        </div>
    );
}

export default function WeatherVisual({
    code,
    isDay = true,
    size = "large",
}) {
    const type =
        getWeatherType(code);

    const night =
        !isDay;

    return (
        <div
            className={`weather-visual weather-visual-${size} weather-type-${type} ${
                night
                    ? "weather-night"
                    : "weather-day"
            }`}
        >
            {type === "clear" && (
                <SunVisual
                    night={night}
                />
            )}

            {type === "partly" && (
                <>
                    <SunVisual
                        night={night}
                    />

                    <CloudVisual />
                </>
            )}

            {type === "overcast" && (
                <>
                    <CloudVisual dark />
                    <CloudVisual />
                </>
            )}

            {type === "fog" && (
                <FogVisual />
            )}

            {type === "drizzle" && (
                <RainVisual />
            )}

            {type === "rain" && (
                <RainVisual
                    heavy={code >= 65}
                />
            )}

            {type === "showers" && (
                <RainVisual />
            )}

            {type === "storm" && (
                <StormVisual />
            )}

            {type === "snow" && (
                <SnowVisual />
            )}

            {![
                "clear",
                "partly",
                "overcast",
                "fog",
                "drizzle",
                "rain",
                "showers",
                "storm",
                "snow",
            ].includes(type) && (
                <Cloud
                    size={56}
                    strokeWidth={1}
                />
            )}
        </div>
    );
}