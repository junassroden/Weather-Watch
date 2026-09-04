import {
    Menu,
    Search,
    MapPin,
    CloudSun,
} from "lucide-react";

import { NavLink } from "react-router-dom";

export default function Header() {
    return (
        <header className="header">
            <div className="container header-inner">

                <NavLink to="/" className="brand">
                    <div className="brand-icon">
                        <CloudSun size={22} />
                    </div>

                    <span>WeatherWatch</span>
                </NavLink>

                <nav className="desktop-nav">

                    <NavLink
                        to="/"
                        end
                        className={({ isActive }) =>
                            isActive ? "active" : ""
                        }
                    >
                        Live Weather
                    </NavLink>

                    <NavLink
                        to="/forecast"
                        className={({ isActive }) =>
                            isActive ? "active" : ""
                        }
                    >
                        Forecast
                    </NavLink>

                    <NavLink
                        to="/satellite-radar"
                        className={({ isActive }) =>
                            isActive ? "active" : ""
                        }
                    >
                        Satellite & Radar
                    </NavLink>

                    <NavLink
                        to="/alerts"
                        className={({ isActive }) =>
                            isActive ? "active" : ""
                        }
                    >
                        Alerts
                    </NavLink>

                </nav>

                <div className="header-actions">

                    <button className="header-icon-button">
                        <Search size={19} />
                    </button>

                    <button
                        className="header-location"
                        onClick={() => {
                            window.location.href = "/";
                        }}
                    >
                        <MapPin size={18} />
                        <span>My Location</span>
                    </button>

                    <button className="header-icon-button mobile-menu">
                        <Menu size={21} />
                    </button>

                </div>

            </div>
        </header>
    );
}