import {
    CloudSun,
    MapPin,
    Search,
} from "lucide-react";

import {
    NavLink,
    useNavigate,
} from "react-router-dom";

export default function Header() {
    const navigate = useNavigate();

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

                <div className="header-actions">

                    <button
                        className="header-action-button"
                        onClick={() =>
                            navigate("/forecast")
                        }
                        aria-label="Search weather"
                    >
                        <Search size={17} />
                        <span>Search</span>
                    </button>

                    <button
                        className="header-action-button location-button"
                        onClick={() => {
                            window.dispatchEvent(
                                new Event(
                                    "weatherwatch:locate"
                                )
                            );
                        }}
                    >
                        <MapPin size={17} />
                        <span>
                            My Location
                        </span>
                    </button>

                </div>
            </div>
        </header>
    );
}