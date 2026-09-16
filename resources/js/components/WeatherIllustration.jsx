import { getWeatherType } from "./WeatherVisual";

/* ------------------------------------------------------------------ */
/* These are static SVG illustrations from "Meteocons" by Bas Milius   */
/* (https://meteocons.com, MIT licensed) — gradient-shaded, soft-      */
/* shadowed weather artwork, not flat line icons. They ship as plain   */
/* files in src/assets/weather-icons/ and are bundled like any other   */
/* image asset; nothing here is a 3D model/WebGL scene, and none of it */
/* replaces WeatherEnvironment's canvas atmosphere — this sits in      */
/* front of that scene as the focal illustration, the same way the     */
/* reference composition layers a weather graphic over a dark card.    */
/* ------------------------------------------------------------------ */

import clearDay from "../assets/weather-icons/clear-day.svg";
import clearNight from "../assets/weather-icons/clear-night.svg";
import partlyDay from "../assets/weather-icons/partly-cloudy-day.svg";
import partlyNight from "../assets/weather-icons/partly-cloudy-night.svg";
import overcastDay from "../assets/weather-icons/overcast-day.svg";
import overcastNight from "../assets/weather-icons/overcast-night.svg";
import fogDay from "../assets/weather-icons/fog-day.svg";
import fogNight from "../assets/weather-icons/fog-night.svg";
import drizzleDay from "../assets/weather-icons/partly-cloudy-day-drizzle.svg";
import drizzleNight from "../assets/weather-icons/partly-cloudy-night-drizzle.svg";
import rain from "../assets/weather-icons/rain.svg";
import showersDay from "../assets/weather-icons/partly-cloudy-day-rain.svg";
import showersNight from "../assets/weather-icons/partly-cloudy-night-rain.svg";
import snow from "../assets/weather-icons/snow.svg";
import stormDay from "../assets/weather-icons/thunderstorms-day.svg";
import stormNight from "../assets/weather-icons/thunderstorms-night.svg";
import cloudy from "../assets/weather-icons/cloudy.svg";

const ILLUSTRATIONS = {
    clear: { day: clearDay, night: clearNight },
    partly: { day: partlyDay, night: partlyNight },
    overcast: { day: overcastDay, night: overcastNight },
    fog: { day: fogDay, night: fogNight },
    drizzle: { day: drizzleDay, night: drizzleNight },
    rain: { day: rain, night: rain },
    showers: { day: showersDay, night: showersNight },
    snow: { day: snow, night: snow },
    storm: { day: stormDay, night: stormNight },
    unknown: { day: cloudy, night: cloudy },
};

export function weatherIllustrationSrc(code, isDay = true) {
    const type = getWeatherType(code);
    const pair = ILLUSTRATIONS[type] || ILLUSTRATIONS.unknown;
    return isDay ? pair.day : pair.night;
}

export default function WeatherIllustration({
    code,
    isDay = true,
    size = 64,
    animated = true,
    className = "",
}) {
    return (
        <img
            src={weatherIllustrationSrc(code, isDay)}
            width={size}
            height={size}
            alt=""
            aria-hidden="true"
            className={`weather-illustration ${animated ? "is-animated" : ""} ${className}`}
        />
    );
}