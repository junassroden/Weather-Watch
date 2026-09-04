import {
    Menu,
    Search,
    MapPin,
    CloudSun
} from "lucide-react";

function Header() {
    return (
        <header className="site-header">
            <a href="/" className="brand">
                <span className="brand-icon">
                    <CloudSun size={22} strokeWidth={2} />
                </span>

                <span>WeatherWatch</span>
            </a>

            <nav className="desktop-nav">
                <a href="#live-weather">Live Weather</a>
                <a href="#forecast">Forecast</a>
                <a href="#satellite">Satellite & Radar</a>
                <a href="#alerts">Alerts</a>
            </nav>

            <div className="header-actions">
                <button className="header-search" aria-label="Search">
                    <Search size={19} />
                    <span>Search</span>
                </button>

                <button className="location-header" aria-label="Location">
                    <MapPin size={18} />
                </button>

                <button className="menu-button" aria-label="Menu">
                    <Menu size={24} />
                </button>
            </div>
        </header>
    );
}

export default Header;