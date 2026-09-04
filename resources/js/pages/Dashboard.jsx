import {
    Activity,
    AlertTriangle,
    Cloud,
    CloudRain,
    Droplets,
    Eye,
    Gauge,
    HeartPulse,
    MapPin,
    Navigation,
    Phone,
    ShieldAlert,
    Sun,
    Sunrise,
    Sunset,
    Thermometer,
    Wind
} from "lucide-react";

import Header from "../components/Header";
import LiveWeatherMap from "../components/LiveWeatherMap";
import WeatherCard from "../components/WeatherCard";
import ForecastCard from "../components/ForecastCard";
import RiskCard from "../components/RiskCard";

function Dashboard() {
    return (
        <div className="weatherwatch-app">

            <Header />

            <main>

                {/* HERO */}

                <section className="hero-section">
                    <div className="hero-content">

                        <div className="hero-badge">
                            <span className="live-dot"></span>
                            REAL-TIME WEATHER MONITORING
                        </div>

                        <h1>
                            Know Your Weather.
                            <br />
                            <span>Before It Reaches You.</span>
                        </h1>

                        <p>
                            WeatherWatch helps you monitor current
                            weather conditions, understand upcoming
                            forecasts, track weather systems, and stay
                            prepared for changing conditions.
                        </p>

                        <div className="hero-search">

                            <MapPin size={19} />

                            <input
                                type="text"
                                placeholder="Search for a city"
                            />

                            <button>
                                Search
                            </button>

                        </div>

                        <button className="use-location-button">
                            <Navigation size={17} />
                            Use My Location
                        </button>

                    </div>

                    <div className="hero-weather-preview">

                        <div className="preview-header">
                            <div>
                                <span>WEATHERWATCH</span>
                                <strong>Current Conditions</strong>
                            </div>

                            <Activity size={21} />
                        </div>

                        <div className="preview-main">

                            <div className="preview-icon">
                                <Cloud size={52} />
                            </div>

                            <div>
                                <span>Temperature</span>
                                <strong>--°</strong>
                            </div>

                        </div>

                        <div className="preview-location">
                            <MapPin size={15} />
                            <span>
                                Waiting for your location
                            </span>
                        </div>

                        <div className="preview-stats">

                            <div>
                                <span>Humidity</span>
                                <strong>--%</strong>
                            </div>

                            <div>
                                <span>Wind</span>
                                <strong>-- km/h</strong>
                            </div>

                            <div>
                                <span>Rain</span>
                                <strong>--%</strong>
                            </div>

                        </div>

                    </div>
                </section>


                {/* LIVE MAP */}

                <LiveWeatherMap />


                {/* CURRENT CONDITIONS */}

                <section
                    className="content-section"
                    id="live-weather"
                >

                    <div className="section-heading">

                        <div>
                            <span className="section-kicker">
                                CURRENT CONDITIONS
                            </span>

                            <h2>
                                Weather right now
                            </h2>

                            <p>
                                A quick overview of the weather
                                conditions at your selected location.
                            </p>
                        </div>

                    </div>

                    <div className="weather-grid">

                        <WeatherCard
                            icon={<Thermometer size={22} />}
                            label="Temperature"
                            value="--°C"
                            description="Current temperature"
                        />

                        <WeatherCard
                            icon={<Thermometer size={22} />}
                            label="Feels Like"
                            value="--°C"
                            description="Perceived temperature"
                        />

                        <WeatherCard
                            icon={<Droplets size={22} />}
                            label="Humidity"
                            value="--%"
                            description="Relative humidity"
                        />

                        <WeatherCard
                            icon={<Wind size={22} />}
                            label="Wind"
                            value="-- km/h"
                            description="Current wind speed"
                        />

                        <WeatherCard
                            icon={<Gauge size={22} />}
                            label="Pressure"
                            value="-- hPa"
                            description="Atmospheric pressure"
                        />

                        <WeatherCard
                            icon={<Eye size={22} />}
                            label="Visibility"
                            value="-- km"
                            description="Current visibility"
                        />

                    </div>

                </section>


                {/* WEATHER OVERVIEW */}

                <section className="content-section">

                    <div className="section-heading">

                        <div>
                            <span className="section-kicker">
                                WEATHER OVERVIEW
                            </span>

                            <h2>
                                Understand the conditions
                            </h2>
                        </div>

                    </div>

                    <div className="overview-grid">

                        <div className="overview-card">
                            <CloudRain size={23} />
                            <span>Chance of Rain</span>
                            <strong>--%</strong>
                            <small>Precipitation probability</small>
                        </div>

                        <div className="overview-card">
                            <Droplets size={23} />
                            <span>Precipitation</span>
                            <strong>-- mm</strong>
                            <small>Expected precipitation</small>
                        </div>

                        <div className="overview-card">
                            <Sun size={23} />
                            <span>UV Index</span>
                            <strong>--</strong>
                            <small>Solar exposure level</small>
                        </div>

                        <div className="overview-card">
                            <Cloud size={23} />
                            <span>Cloud Cover</span>
                            <strong>--%</strong>
                            <small>Sky coverage</small>
                        </div>

                        <div className="overview-card">
                            <Wind size={23} />
                            <span>Wind Gust</span>
                            <strong>-- km/h</strong>
                            <small>Maximum expected gust</small>
                        </div>

                        <div className="overview-card">
                            <HeartPulse size={23} />
                            <span>Air Quality</span>
                            <strong>--</strong>
                            <small>Local air quality</small>
                        </div>

                    </div>

                </section>


                {/* FORECAST */}

                <section
                    className="content-section"
                    id="forecast"
                >

                    <div className="section-heading forecast-heading">

                        <div>
                            <span className="section-kicker">
                                WEATHER FORECAST
                            </span>

                            <h2>
                                The next 5 days
                            </h2>

                            <p>
                                Plan ahead with WeatherWatch's
                                upcoming weather forecast.
                            </p>
                        </div>

                        <button className="outline-button">
                            View Full Forecast
                        </button>

                    </div>

                    <div className="forecast-grid">

                        <ForecastCard
                            day="Monday"
                            date="--"
                            icon={<Cloud size={30} />}
                            condition="Waiting for data"
                            high="--°"
                            low="--°"
                            rain="--%"
                        />

                        <ForecastCard
                            day="Tuesday"
                            date="--"
                            icon={<CloudRain size={30} />}
                            condition="Waiting for data"
                            high="--°"
                            low="--°"
                            rain="--%"
                        />

                        <ForecastCard
                            day="Wednesday"
                            date="--"
                            icon={<Sun size={30} />}
                            condition="Waiting for data"
                            high="--°"
                            low="--°"
                            rain="--%"
                        />

                        <ForecastCard
                            day="Thursday"
                            date="--"
                            icon={<Cloud size={30} />}
                            condition="Waiting for data"
                            high="--°"
                            low="--°"
                            rain="--%"
                        />

                        <ForecastCard
                            day="Friday"
                            date="--"
                            icon={<CloudRain size={30} />}
                            condition="Waiting for data"
                            high="--°"
                            low="--°"
                            rain="--%"
                        />

                    </div>

                </section>


                {/* SUN */}

                <section className="sun-section">

                    <div className="sun-card">

                        <div className="sun-icon">
                            <Sunrise size={25} />
                        </div>

                        <div>
                            <span>Sunrise</span>
                            <strong>--:-- AM</strong>
                        </div>

                    </div>

                    <div className="daylight-line">

                        <div className="daylight-top">
                            <span>DAYLIGHT</span>
                            <span>WeatherWatch</span>
                        </div>

                        <div className="daylight-track">
                            <div className="daylight-position"></div>
                        </div>

                        <div className="daylight-bottom">
                            <span>Morning</span>
                            <span>Afternoon</span>
                            <span>Evening</span>
                        </div>

                    </div>

                    <div className="sun-card">

                        <div className="sun-icon">
                            <Sunset size={25} />
                        </div>

                        <div>
                            <span>Sunset</span>
                            <strong>--:-- PM</strong>
                        </div>

                    </div>

                </section>


                {/* RISK */}

                <section className="content-section">

                    <div className="section-heading">

                        <div>
                            <span className="section-kicker">
                                WEATHER SAFETY
                            </span>

                            <h2>
                                Stay aware of weather risks
                            </h2>

                            <p>
                                WeatherWatch analyzes weather
                                conditions to help you understand
                                potential local risks.
                            </p>
                        </div>

                    </div>

                    <RiskCard />

                </section>


                {/* ALERTS */}

                <section
                    className="content-section"
                    id="alerts"
                >

                    <div className="section-heading">

                        <div>
                            <span className="section-kicker">
                                LOCAL WEATHER ALERTS
                            </span>

                            <h2>
                                Stay informed
                            </h2>

                            <p>
                                Important weather information for
                                your selected location.
                            </p>
                        </div>

                    </div>

                    <div className="alerts-empty">

                        <div className="alerts-empty-icon">
                            <ShieldAlert size={27} />
                        </div>

                        <div>
                            <h3>
                                Weather alerts will appear here
                            </h3>

                            <p>
                                WeatherWatch will display relevant
                                weather alerts and safety information
                                when available.
                            </p>
                        </div>

                    </div>

                </section>


                {/* EMERGENCY */}

                <section className="emergency-section">

                    <div className="emergency-icon">
                        <Phone size={28} />
                    </div>

                    <div className="emergency-content">

                        <span>EMERGENCY ASSISTANCE</span>

                        <h2>
                            Need emergency assistance?
                        </h2>

                        <p>
                            If you are experiencing an emergency,
                            contact the appropriate emergency services.
                        </p>

                    </div>

                    <a
                        href="tel:911"
                        className="emergency-button"
                    >
                        <Phone size={19} />
                        CALL 911
                    </a>

                </section>

            </main>


            {/* FOOTER */}

            <footer className="site-footer">

                <div className="footer-brand">

                    <div className="brand">
                        <span className="brand-icon">
                            <CloudSunIcon />
                        </span>

                        <span>WeatherWatch</span>
                    </div>

                    <p>
                        Real-time weather monitoring for better
                        awareness, preparation, and safety.
                    </p>

                </div>

                <div className="footer-links">

                    <a href="#live-weather">
                        Live Weather
                    </a>

                    <a href="#forecast">
                        Forecast
                    </a>

                    <a href="#satellite">
                        Satellite & Radar
                    </a>

                    <a href="#alerts">
                        Alerts & Safety
                    </a>

                </div>

                <div className="footer-bottom">

                    <span>
                        © 2026 WeatherWatch
                    </span>

                    <span>
                        Weather monitoring system
                    </span>

                </div>

            </footer>

        </div>
    );
}

function CloudSunIcon() {
    return (
        <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <circle cx="17" cy="5" r="3" />
            <path d="M3 16a4 4 0 0 1 4-4h1" />
            <path d="M8 20h8a4 4 0 0 0 .88-7.9A5 5 0 0 0 7.1 14.4" />
            <path d="M7 16v.01" />
        </svg>
    );
}

export default Dashboard;