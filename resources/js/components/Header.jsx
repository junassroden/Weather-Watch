import {
    CloudSun,
} from "lucide-react";

import {
    NavLink,
} from "react-router-dom";

export default function Header() {
    const navClass = ({ isActive }) =>
        `header-nav-link ${
            isActive ? "active" : ""
        }`;

    return (
        <header className="site-header">
            <div className="container header-inner">

                <NavLink
                    to="/"
                    className="brand"
                >
                    <span className="brand-mark">
                        <CloudSun size={21} />
                    </span>

                    <span className="brand-name">
                        WeatherWatch
                    </span>
                </NavLink>

                <nav className="desktop-nav">
                    <NavLink
                        to="/"
                        end
                        className={navClass}
                    >
                        Live Weather
                    </NavLink>

                    <NavLink
                        to="/forecast"
                        className={navClass}
                    >
                        Forecast
                    </NavLink>

                    <NavLink
                        to="/satellite-radar"
                        className={navClass}
                    >
                        Satellite & Radar
                    </NavLink>

                    <NavLink
                        to="/alerts"
                        className={navClass}
                    >
                        Alerts
                    </NavLink>
                </nav>

            </div>
        </header>
    );
}