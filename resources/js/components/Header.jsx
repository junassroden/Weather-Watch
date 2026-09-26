import { LocateFixed } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";

import LocationSearch from "./LocationSearch";

/* One header for every page. `showSearch` is false only where the page
   already renders a LocationSearch of its own (the forecast landing), so
   the same control never appears twice on screen. */
export default function Header({ onUseLocation, onLocationSelect, showSearch = true }) {
    const { pathname } = useLocation();
    const navClass = (isCurrentRoute = false) => ({ isActive }) =>
        `header-nav-link ${isActive || isCurrentRoute ? "active" : ""}`;

    return (
        <header className="site-header">
            <div className="container header-inner">
                <NavLink to="/" className="brand">
                    <span className="brand-name">WeatherWatch</span>
                </NavLink>

                <nav className="desktop-nav" aria-label="Primary navigation">
                    <NavLink to="/" end className={navClass(pathname === "/current-weather")}>Current</NavLink>
                    <NavLink to="/forecast" className={navClass()}>Forecast</NavLink>
                    <NavLink to="/satellite-radar" className={navClass()}>Map</NavLink>
                    <NavLink to="/weather-history" className={navClass()}>History</NavLink>
                    <NavLink to="/alerts" className={navClass()}>Alerts</NavLink>
                </nav>

                <div className="header-actions">
                    {showSearch && onLocationSelect && (
                        <LocationSearch
                            onLocationSelect={onLocationSelect}
                            placeholder="Search city or place"
                            variant="header"
                        />
                    )}

                    {onUseLocation && <button className="use-location-button" onClick={onUseLocation} type="button">
                        <LocateFixed size={17} aria-hidden="true" />
                        <span>Use my location</span>
                    </button>}
                </div>
            </div>
        </header>
    );
}