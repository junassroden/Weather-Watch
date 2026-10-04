import { useMemo, useState } from "react";
import AppHeader from "../components/AppHeader";
import WeatherScene3D from "../components/WeatherScene3D";
import useWeather from "../hooks/useWeather";
import { formatHour, formatTime, getCurrentHourIndex, getTodayIndex, longDay, shortDay, weatherLabel } from "../lib/weather";

export default function Forecast() {
    const state = useWeather();
    const { weather, forecast, selectLocation, useCurrentLocation, locationName } = state;
    const daily = forecast?.daily;
    const hourly = forecast?.hourly;
    const todayIndex = getTodayIndex(daily, weather?.updated_at);
    const [selectedOffset, setSelectedOffset] = useState(0);
    const selectedDay = todayIndex + selectedOffset;
    const selectedDate = daily?.time?.[selectedDay];
    const hourIndexes = useMemo(() => hourly?.time?.map((time, index) => ({ time, index })).filter((item) => item.time?.startsWith(selectedDate)).map((item) => item.index).slice(0, 24) || [], [hourly, selectedDate]);

    return (
        <div className="ww-app-shell">
            <AppHeader onLocationSelect={selectLocation} onUseLocation={useCurrentLocation} />
            <main className="ww-main ww-forecast-page">
                <section className="ww-forecast-intro">
                    <div><span className="ww-eyebrow">FORECAST / {locationName}</span><h1>Seven days, one atmospheric story.</h1><p>Select a day to inspect the 24-hour transition, temperature rhythm, precipitation and daylight window.</p></div>
                    <div className="ww-forecast-scene"><WeatherScene3D code={daily?.weather_code?.[selectedDay] ?? weather?.weather_code ?? 2} isDay compact /></div>
                </section>

                <section className="ww-day-selector" aria-label="Choose forecast day">
                    {Array.from({ length: 7 }, (_, offset) => todayIndex + offset).filter((i) => daily?.time?.[i]).map((index, offset) => (
                        <button key={daily.time[index]} className={selectedOffset === offset ? "is-active" : ""} onClick={() => setSelectedOffset(offset)}>
                            <span>{offset === 0 ? "Today" : shortDay(daily.time[index])}</span>
                            <strong>{Math.round(daily.temperature_2m_max?.[index] ?? 0)}°</strong>
                            <small>{weatherLabel(daily.weather_code?.[index])}</small>
                        </button>
                    ))}
                </section>

                <section className="ww-forecast-detail">
                    <div className="ww-forecast-title"><span className="ww-eyebrow">SELECTED DAY</span><h2>{longDay(selectedDate)}</h2><p>{weatherLabel(daily?.weather_code?.[selectedDay])} · High {Math.round(daily?.temperature_2m_max?.[selectedDay] ?? 0)}° · Low {Math.round(daily?.temperature_2m_min?.[selectedDay] ?? 0)}°</p></div>
                    <div className="ww-temp-graph">
                        {hourIndexes.map((index) => {
                            const value = hourly.temperature_2m?.[index] ?? 0;
                            return <div key={hourly.time[index]} className="ww-temp-point"><span>{Math.round(value)}°</span><i style={{ height: `${Math.max(18, (value + 5) * 2.1)}px` }} /><small>{formatHour(hourly.time[index])}</small></div>;
                        })}
                    </div>
                    <div className="ww-forecast-facts">
                        <div><span>Rain probability</span><strong>{daily?.precipitation_probability_max?.[selectedDay] ?? 0}%</strong></div>
                        <div><span>Precipitation</span><strong>{daily?.precipitation_sum?.[selectedDay] ?? 0} mm</strong></div>
                        <div><span>Sunrise</span><strong>{formatTime(daily?.sunrise?.[selectedDay])}</strong></div>
                        <div><span>Sunset</span><strong>{formatTime(daily?.sunset?.[selectedDay])}</strong></div>
                    </div>
                </section>
            </main>
        </div>
    );
}
