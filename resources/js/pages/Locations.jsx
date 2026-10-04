import { useEffect, useState } from "react";
import { Crosshair, MapPin, Search, Star, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import AppHeader from "../components/AppHeader";
import WeatherScene3D from "../components/WeatherScene3D";
import useWeather from "../hooks/useWeather";
import { searchLocation } from "../services/api";
import { weatherLabel } from "../lib/weather";

export default function Locations() {
    const state = useWeather();
    const { locationName, locationDetail, weather, selectLocation, useCurrentLocation } = state;
    const [query, setQuery] = useState("");
    const [results, setResults] = useState([]);
    const [saved, setSaved] = useState(() => JSON.parse(localStorage.getItem("weatherwatch.saved") || "[]"));
    const navigate = useNavigate();

    useEffect(() => {
        if (query.trim().length < 2) { setResults([]); return; }
        const controller = new AbortController();
        const timer = setTimeout(() => searchLocation(query, { signal: controller.signal }).then(setResults).catch(() => setResults([])), 250);
        return () => { clearTimeout(timer); controller.abort(); };
    }, [query]);

    const saveCurrent = () => {
        const item = { name: locationName, detail: locationDetail, latitude: weather?.location?.latitude, longitude: weather?.location?.longitude };
        const next = [item, ...saved.filter((entry) => entry.name !== item.name)].slice(0, 8);
        setSaved(next);
        localStorage.setItem("weatherwatch.saved", JSON.stringify(next));
    };

    const choose = (item) => {
        selectLocation(item);
        setQuery("");
        setResults([]);
    };

    return (
        <div className="ww-app-shell">
            <AppHeader onLocationSelect={choose} onUseLocation={useCurrentLocation} />
            <main className="ww-main ww-locations-page">
                <section className="ww-location-stage">
                    <div className="ww-location-copy"><span className="ww-eyebrow">LOCATIONS</span><h1>Move through weather, not menus.</h1><p>Search a city, use your position, or return to a saved place. The atmospheric scene transitions with the active weather.</p>
                        <div className="ww-location-search-large"><Search size={20} /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search city or municipality" autoFocus /><button onClick={useCurrentLocation}><Crosshair size={18} /> Current</button></div>
                        {results.length > 0 && <div className="ww-location-results">{results.slice(0, 8).map((item) => <button key={`${item.latitude}-${item.longitude}`} onClick={() => choose(item)}><MapPin size={16} /><span><strong>{item.name}</strong><small>{[item.admin1, item.country].filter(Boolean).join(", ")}</small></span></button>)}</div>}
                    </div>
                    <div className="ww-active-location"><WeatherScene3D code={weather?.weather_code ?? 2} isDay={weather?.is_day !== 0} compact /><div className="ww-active-location-caption"><span>ACTIVE LOCATION</span><h2>{locationName}</h2><p>{weather?.temperature == null ? "--" : `${Math.round(weather.temperature)}°`} · {weatherLabel(weather?.weather_code)}</p><button onClick={saveCurrent}><Star size={16} /> Save location</button></div></div>
                </section>

                <section className="ww-saved-locations"><div className="ww-section-heading"><div><span className="ww-eyebrow">SAVED PLACES</span><h2>Your weather orbit</h2></div></div>
                    {saved.length ? <div className="ww-saved-list">{saved.map((item) => <div className="ww-saved-row" key={item.name}><button onClick={() => { choose(item); navigate("/dashboard"); }}><span><strong>{item.name}</strong><small>{item.detail}</small></span><span>View weather</span></button><button className="ww-remove-location" aria-label={`Remove ${item.name}`} onClick={() => { const next = saved.filter((entry) => entry.name !== item.name); setSaved(next); localStorage.setItem("weatherwatch.saved", JSON.stringify(next)); }}><Trash2 size={16} /></button></div>)}</div> : <p className="ww-empty-copy">No saved locations yet. Save the active location to build your list.</p>}
                </section>
            </main>
        </div>
    );
}
