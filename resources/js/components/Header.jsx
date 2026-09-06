import { Bell, CloudSun, LocateFixed, Menu, Search, X } from "lucide-react";
import { useState } from "react";
import { NavLink } from "react-router-dom";
import { searchLocation } from "../services/api";

export default function Header({ onUseLocation, onLocationSelect }) {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState([]);
    const [menuOpen, setMenuOpen] = useState(false);

    const submitSearch = async (event) => {
        event.preventDefault();
        if (!query.trim()) return;

        try {
            setResults(await searchLocation(query.trim()));
        } catch {
            setResults([]);
        }
    };

    const selectLocation = (result) => {
        setQuery(result.name);
        setResults([]);
        onLocationSelect?.(result);
    };

    const navClass = ({ isActive }) => `header-nav-link ${isActive ? "active" : ""}`;

    return (
        <header className="site-header">
            <div className="container header-inner">
                <NavLink to="/" className="brand"><span className="brand-mark"><CloudSun size={21} /></span><span className="brand-name">WeatherWatch</span></NavLink>
                <button className="mobile-menu-button" onClick={() => setMenuOpen((open) => !open)} aria-label="Toggle navigation">{menuOpen ? <X size={20} /> : <Menu size={20} />}</button>
                <nav className={`desktop-nav ${menuOpen ? "is-open" : ""}`}>
                    <NavLink to="/" end className={navClass} onClick={() => setMenuOpen(false)}>Current Weather</NavLink>
                    <NavLink to="/forecast" className={navClass} onClick={() => setMenuOpen(false)}>Forecast</NavLink>
                    <NavLink to="/satellite-radar" className={navClass} onClick={() => setMenuOpen(false)}>Satellite & Radar</NavLink>
                    <NavLink to="/alerts" className={navClass} onClick={() => setMenuOpen(false)}>Alerts</NavLink>
                </nav>
                <div className="header-actions">
                    <form className="location-search" onSubmit={submitSearch}><Search size={16} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search location" aria-label="Search location" />{results.length > 0 && <div className="search-results">{results.slice(0, 5).map((result) => <button type="button" key={`${result.latitude}-${result.longitude}`} onClick={() => selectLocation(result)}><span>{result.name}</span><small>{[result.admin1, result.country].filter(Boolean).join(", ")}</small></button>)}</div>}</form>
                    <button className="header-icon-button" onClick={onUseLocation} title="Use my location"><LocateFixed size={17} /></button>
                    <NavLink to="/alerts" className="header-icon-button" title="Alerts"><Bell size={17} /></NavLink>
                </div>
            </div>
        </header>
    );
}