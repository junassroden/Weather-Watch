import AppHeader from "../components/AppHeader";
import WeatherScene3D from "../components/WeatherScene3D";
import useWeather from "../hooks/useWeather";
import { formatHour, formatTime, getCurrentHourIndex, getTodayIndex, shortDay, weatherLabel, windCompass } from "../lib/weather";
import { CloudRain, Droplets, Eye, Gauge, Navigation, ShieldAlert, Sunrise, Sunset, ThermometerSun, Wind } from "lucide-react";

function Metric({ icon: Icon, label, value, detail }) {
    return (
        <div className="ww-metric">
            <div className="ww-metric-icon"><Icon size={18} strokeWidth={1.5} /></div>
            <div><span>{label}</span><strong>{value}</strong>{detail && <small>{detail}</small>}</div>
        </div>
    );
}

export default function Dashboard() {
    const weatherState = useWeather();
    const { locationName, locationDetail, weather, forecast, risk, alerts, loading, error, selectLocation, useCurrentLocation } = weatherState;
    const daily = forecast?.daily;
    const hourly = forecast?.hourly;
    const todayIndex = getTodayIndex(daily, weather?.updated_at);
    const currentHourIndex = getCurrentHourIndex(hourly, weather?.updated_at);
    const hourIndexes = Array.from({ length: 12 }, (_, i) => currentHourIndex + i).filter((i) => hourly?.time?.[i]);
    const dayIndexes = Array.from({ length: 7 }, (_, i) => todayIndex + i).filter((i) => daily?.time?.[i]);
    const tempUnit = weather?.units?.temperature_2m || "°C";
    const high = daily?.temperature_2m_max?.[todayIndex];
    const low = daily?.temperature_2m_min?.[todayIndex];
    const officialAlerts = alerts?.official_alerts || [];

    return (
        <div className="ww-app-shell">
            <AppHeader onLocationSelect={selectLocation} onUseLocation={useCurrentLocation} />
            <main className="ww-main">
                {error && <div className="ww-inline-alert" role="alert">{error}</div>}

                <section className="ww-hero" aria-labelledby="current-weather-heading">
                    <WeatherScene3D code={weather?.weather_code ?? 2} isDay={weather?.is_day !== 0} />
                    <div className="ww-hero-overlay">
                        <div className="ww-location-block">
                            <span className="ww-eyebrow">CURRENT ATMOSPHERE</span>
                            <h1 id="current-weather-heading">{locationName || "Current location"}</h1>
                            <p>{locationDetail || "Live weather conditions"}</p>
                        </div>

                        <div className="ww-temperature-block">
                            <div className="ww-temperature">{weather?.temperature == null ? "--" : Math.round(weather.temperature)}<sup>{tempUnit}</sup></div>
                            <div className="ww-condition-row">
                                <strong>{loading ? "Reading the atmosphere…" : weatherLabel(weather?.weather_code)}</strong>
                                <span>Feels {weather?.feels_like == null ? "--" : `${Math.round(weather.feels_like)}${tempUnit}`}</span>
                                <span>H {high == null ? "--" : `${Math.round(high)}°`} / L {low == null ? "--" : `${Math.round(low)}°`}</span>
                                {weather?.condition_note && <span>{weather.condition_note}</span>}
                            </div>
                        </div>

                        <div className="ww-hero-status">
                            <span>OPEN-METEO MODEL</span>
                            <span>{weather?.updated_at ? `Updated ${formatTime(weather.updated_at)}` : "Awaiting model data"}</span>
                        </div>
                    </div>
                </section>

                <section className="ww-section ww-hourly-section">
                    <div className="ww-section-heading">
                        <div><span className="ww-eyebrow">NEXT 12 HOURS</span><h2>Weather in motion</h2></div>
                        <span className="ww-section-note">Swipe or scroll horizontally</span>
                    </div>
                    <div className="ww-hourly-track">
                        {hourIndexes.map((index, position) => {
                            const code = hourly.weather_code?.[index];
                            const rain = hourly.precipitation_probability?.[index];
                            return (
                                <article className={`ww-hour ${position === 0 ? "is-current" : ""}`} key={hourly.time[index]}>
                                    <span className="ww-hour-time">{position === 0 ? "Now" : formatHour(hourly.time[index])}</span>
                                    <div className="ww-mini-orbit" data-weather={code}><span /></div>
                                    <strong>{Math.round(hourly.temperature_2m?.[index] ?? 0)}°</strong>
                                    <div className="ww-hour-meta"><span>{rain ?? 0}% rain</span><span>{Math.round(hourly.wind_speed_10m?.[index] ?? 0)} km/h</span></div>
                                </article>
                            );
                        })}
                    </div>
                </section>

                <section className="ww-section ww-week-section">
                    <div className="ww-section-heading"><div><span className="ww-eyebrow">7-DAY OUTLOOK</span><h2>The week ahead</h2></div></div>
                    <div className="ww-week-list">
                        {dayIndexes.map((index, position) => (
                            <div className={`ww-day-row ${position === 0 ? "is-selected" : ""}`} key={daily.time[index]}>
                                <div><strong>{position === 0 ? "Today" : shortDay(daily.time[index])}</strong><span>{weatherLabel(daily.weather_code?.[index])}</span></div>
                                <div className="ww-day-rain"><CloudRain size={16} strokeWidth={1.5} /> {daily.precipitation_probability_max?.[index] ?? 0}%</div>
                                <div className="ww-temp-range"><span>{Math.round(daily.temperature_2m_min?.[index] ?? 0)}°</span><i><b style={{ width: `${Math.max(18, Math.min(100, ((daily.temperature_2m_max?.[index] ?? 30) - 15) * 5))}%` }} /></i><strong>{Math.round(daily.temperature_2m_max?.[index] ?? 0)}°</strong></div>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="ww-section ww-details-section">
                    <div className="ww-section-heading"><div><span className="ww-eyebrow">ATMOSPHERIC DETAILS</span><h2>What the air is doing</h2></div></div>
                    <div className="ww-metrics-grid">
                        <Metric icon={Droplets} label="Humidity" value={`${weather?.humidity ?? "--"}%`} detail={`Dew point ${weather?.dew_point == null ? "--" : `${Math.round(weather.dew_point)}°`}`} />
                        <Metric icon={Wind} label="Wind" value={`${Math.round(weather?.wind_speed ?? 0)} km/h`} detail={`${windCompass(weather?.wind_direction)} · Gusts ${Math.round(weather?.wind_gust ?? 0)} km/h`} />
                        <Metric icon={Gauge} label="Pressure" value={`${Math.round(weather?.pressure ?? 0)} hPa`} detail="Mean sea level" />
                        <Metric icon={Eye} label="Visibility" value={`${weather?.visibility == null ? "--" : (weather.visibility / 1000).toFixed(1)} km`} detail="Horizontal visibility" />
                        <Metric icon={ThermometerSun} label="UV index" value={weather?.uv_index == null ? "--" : Number(weather.uv_index).toFixed(1)} detail="Current exposure" />
                        <Metric icon={Sunrise} label="Sunrise" value={formatTime(daily?.sunrise?.[todayIndex])} detail={`Sunset ${formatTime(daily?.sunset?.[todayIndex])}`} />
                    </div>
                </section>

                <section className="ww-section ww-risk-section">
                    <div className="ww-risk-summary">
                        <div className="ww-risk-icon"><ShieldAlert size={28} strokeWidth={1.35} /></div>
                        <div><span className="ww-eyebrow">WEATHER RISK</span><h2>{risk?.level ? `${risk.level} local risk` : "Risk assessment pending"}</h2><p>{risk?.reasons?.[0] || "No significant local hazards detected from the available forecast."}</p></div>
                        <div className={`ww-risk-pill level-${(risk?.level || "LOW").toLowerCase()}`}>{officialAlerts.length ? `${officialAlerts.length} official alert${officialAlerts.length > 1 ? "s" : ""}` : "No official alerts"}</div>
                    </div>
                </section>
            </main>
        </div>
    );
}
