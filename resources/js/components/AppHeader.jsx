import { useEffect, useRef, useState } from "react";
import { NavLink } from "react-router-dom";
import { Crosshair, Menu, Search, X } from "lucide-react";
import { searchLocation } from "../services/api";

const links = [
    ["/dashboard", "Weather"],
    ["/forecast", "Forecast"],
    ["/satellite-radar", "Radar"],
    ["/alerts", "Alerts"],
    ["/locations", "Locations"],
];

export default function AppHeader({ onLocationSelect, onUseLocation }) {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState([]);
    const [open, setOpen] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const timer = useRef(null);

    useEffect(() => {
        clearTimeout(timer.current);
        if (query.trim().length < 2) { setResults([]); return; }
        const controller = new AbortController();
        timer.current = setTimeout(async () => {
            try { setResults(await searchLocation(query.trim(), { signal: controller.signal })); }
            catch { setResults([]); }
        }, 260);
        return () => { clearTimeout(timer.current); controller.abort(); };
    }, [query]);

    const choose = (item) => {
        onLocationSelect?.(item);
        setQuery("");
        setResults([]);
        setOpen(false);
        setMenuOpen(false);
    };

    return (
        <header className="ww-header">
            <NavLink to="/dashboard" className="ww-brand" aria-label="Weather Watch home">
                <span className="ww-brand-mark"><span /></span>
                <span><strong>WEATHER</strong><b>WATCH</b></span>
            </NavLink>

            <nav className="ww-nav" aria-label="Main navigation">
                {links.map(([to, label]) => <NavLink key={to} to={to}>{label}</NavLink>)}
            </nav>

            <div className="ww-header-actions">
                <div className={`ww-search-shell ${open ? "is-open" : ""}`}>
                    <Search size={16} strokeWidth={1.6} />
                    <input
                        value={query}
                        onFocus={() => setOpen(true)}
                        onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
                        placeholder="Search city"
                        aria-label="Search for a location"
                    />
                    {open && results.length > 0 && (
                        <div className="ww-search-results">
                            {results.slice(0, 6).map((item) => (
                                <button key={`${item.latitude}-${item.longitude}`} onClick={() => choose(item)}>
                                    <strong>{item.name}</strong>
                                    <span>{[item.admin1, item.country].filter(Boolean).join(", ")}</span>
                                </button>
                            ))}
                        </div>
                    )}
                </div>
                <button className="ww-icon-button" onClick={onUseLocation} aria-label="Use current location"><Crosshair size={18} strokeWidth={1.6} /></button>
                <button className="ww-menu-button" onClick={() => setMenuOpen((value) => !value)} aria-label="Toggle navigation">{menuOpen ? <X /> : <Menu />}</button>
            </div>

            {menuOpen && (
                <div className="ww-mobile-menu">
                    {links.map(([to, label]) => <NavLink key={to} to={to} onClick={() => setMenuOpen(false)}>{label}</NavLink>)}
                </div>
            )}
        </header>
    );
}
