import { Bell, CloudSun, Crosshair, List, X } from "lucide-react";
import { useState } from "react";
import { NavLink } from "react-router-dom";

import LocationSearch from "./LocationSearch";

/* One header for every page. `showSearch` is false only where the page
   already renders a LocationSearch of its own (the forecast landing), so
   the same control never appears twice on screen. */
export default function Header({ onUseLocation, onLocationSelect, showSearch = true }) {
    const [menuOpen, setMenuOpen] = useState(false);
    const navClass = ({ isActive }) => `header-nav-link ${isActive ? "active" : ""}`;
    const close = () => setMenuOpen(false);

    return (
        <header className="site-header">
            <div className="container header-inner">
                <NavLink to="/" className="brand">
                    <span className="brand-mark"><CloudSun size={19} weight="thin" /></span>
                    <span className="brand-name">WeatherWatch</span>
                </NavLink>

                <button
                    className="mobile-menu-button"
                    onClick={() => setMenuOpen((open) => !open)}
                    aria-label="Toggle navigation"
                    aria-expanded={menuOpen}
                >
                    {menuOpen ? <X size={19} weight="thin" /> : <List size={19} weight="thin" />}
                </button>

                <nav className={`desktop-nav ${menuOpen ? "is-open" : ""}`}>
                    <NavLink to="/current-weather" className={navClass} onClick={close}>Current Weather</NavLink>
                    <NavLink to="/satellite-radar" className={navClass} onClick={close}>Satellite &amp; Radar</NavLink>
                    <NavLink to="/forecast" className={navClass} onClick={close}>Forecast</NavLink>
                    <NavLink to="/weather-history" className={navClass} onClick={close}>History</NavLink>
                    <NavLink to="/alerts" className={navClass} onClick={close}>Alerts</NavLink>
                </nav>

                <div className="header-actions">
                    {showSearch && (
                        <LocationSearch
                            onLocationSelect={onLocationSelect}
                            placeholder="Search location"
                            variant="header"
                        />
                    )}

                    <button
                        className="header-icon-button"
                        onClick={onUseLocation}
                        title="Use my location"
                        type="button"
                    >
                        <Crosshair size={17} weight="thin" />
                    </button>

                    <NavLink to="/alerts" className="header-icon-button" title="Alerts">
                        <Bell size={17} weight="thin" />
                    </NavLink>
                </div>
            </div>
        </header>
    );
}