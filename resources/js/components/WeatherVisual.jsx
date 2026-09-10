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

function ParticleField({
    kind,
    count,
}) {
    return (
        <div className={`weather-particles weather-particles-${kind}`} aria-hidden="true">
            {Array.from({ length: count }, (_, index) => (
                <i
                    key={index}
                    style={{
                        "--particle-x": `${8 + ((index * 17) % 84)}%`,
                        "--particle-delay": `${(index % 7) * -0.32}s`,
                        "--particle-scale": `${0.65 + ((index % 3) * 0.2)}`,
                    }}
                />
            ))}
        </div>
    );
}

function CloudMass({
    muted = false,
}) {
    return (
        <div className={`weather-cloud-mass ${muted ? "is-muted" : ""}`} aria-hidden="true">
            <span className="cloud-volume cloud-volume-back" />
            <span className="cloud-volume cloud-volume-mid" />
            <span className="cloud-volume cloud-volume-front" />
            <span className="cloud-shadow" />
        </div>
    );
}

function WeatherScene({
    type,
    night,
    code,
}) {
    const precipitation = type === "drizzle" || type === "rain" || type === "showers" || type === "storm";
    const heavy = type === "rain" && code >= 65 || type === "storm";

    return (
        <div className="weather-scene" aria-hidden="true">
            <div className="scene-horizon" />

            {(type === "clear" || type === "partly") && (
                <div className="weather-sun-orb">
                    <span className="sun-orb-core" />
                    <span className="sun-orb-corona" />
                </div>
            )}

            {night && <div className="weather-moon-orb"><span /></div>}

            {(type === "partly" || type === "overcast" || precipitation || type === "snow" || type === "fog") && (
                <CloudMass muted={type === "partly"} />
            )}

            {type === "fog" && <ParticleField kind="fog" count={4} />}
            {type === "drizzle" && <ParticleField kind="drizzle" count={9} />}
            {type === "rain" && <ParticleField kind={heavy ? "heavy-rain" : "rain"} count={heavy ? 15 : 11} />}
            {type === "showers" && <ParticleField kind="showers" count={12} />}
            {type === "snow" && <ParticleField kind="snow" count={11} />}

            {type === "storm" && (
                <>
                    <span className="storm-flash" />
                    <span className="storm-bolt" />
                    <ParticleField kind="heavy-rain" count={15} />
                </>
            )}

            {type === "clear" && <span className="weather-wind-trace trace-one" />}
            {type === "partly" && <span className="weather-wind-trace trace-two" />}

            {type === "unknown" && <span className="weather-scan-orb" />}
        </div>
    );
}

export default function WeatherVisual({
    code,
    isDay = true,
    size = "large",
}) {
    const type = getWeatherType(code);
    const night = !isDay;

    return (
        <div
            className={`weather-visual weather-visual-${size} weather-type-${type} ${night ? "weather-night" : "weather-day"}`}
            role="img"
            aria-label={weatherLabel(code)}
        >
            <WeatherScene type={type} night={night} code={code} />
        </div>
    );
}