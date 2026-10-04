import { NavLink, useLocation } from "react-router-dom";

import LocationSearch from "./LocationSearch";

export default function Header({ onUseLocation, onLocationSelect, showSearch = true }) {
    const { pathname } = useLocation();

    return (
        <header>
            <nav aria-label="Primary navigation">
                <NavLink to="/" end={pathname === "/" || pathname === "/current-weather"}>Current</NavLink>
                <NavLink to="/forecast">Forecast</NavLink>
                <NavLink to="/satellite-radar">Map</NavLink>
                <NavLink to="/weather-history">History</NavLink>
                <NavLink to="/alerts">Alerts</NavLink>
            </nav>

            {showSearch && onLocationSelect && (
                <LocationSearch
                    onLocationSelect={onLocationSelect}
                    placeholder="Search city or place"
                    variant="header"
                />
            )}

            {onUseLocation && (
                <button onClick={onUseLocation} type="button">
                    Use my location
                </button>
            )}
        </header>
    );
}