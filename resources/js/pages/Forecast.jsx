import {
    useEffect,
    useState,
} from "react";

import Header from "../components/Header";
import ForecastCard from "../components/ForecastCard";

import {
    getForecast,
    reverseLocation,
} from "../services/api";

export default function Forecast() {
    const [forecast, setForecast] =
        useState(null);

    const [locationName, setLocationName] =
        useState("Current Location");

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    useEffect(() => {
        if (!navigator.geolocation) {
            setError(
                "Geolocation is not supported."
            );

            setLoading(false);

            return;
        }

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const latitude =
                    position.coords.latitude;

                const longitude =
                    position.coords.longitude;

                try {
                    const [
                        forecastData,
                        locationData,
                    ] = await Promise.all([
                        getForecast(
                            latitude,
                            longitude
                        ),
                        reverseLocation(
                            latitude,
                            longitude
                        ),
                    ]);

                    setForecast(
                        forecastData
                    );

                    setLocationName(
                        locationData.city ||
                        locationData.display_name ||
                        "Current Location"
                    );
                } catch {
                    setError(
                        "Unable to load forecast data."
                    );
                } finally {
                    setLoading(false);
                }
            },
            () => {
                setError(
                    "Location permission was denied."
                );

                setLoading(false);
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 300000,
            }
        );
    }, []);

    return (
        <div className="weather-app">

            <Header />

            <main className="page-content">

                <div className="container">

                    <div className="page-header">

                        <span className="eyebrow">
                            FORECAST
                        </span>

                        <h1>
                            7-Day Weather Forecast
                        </h1>

                        <p>
                            Extended weather conditions
                            for {locationName}.
                        </p>

                    </div>

                    {loading && (
                        <div className="page-loading">
                            Loading forecast...
                        </div>
                    )}

                    {error && (
                        <div className="error-panel">
                            {error}
                        </div>
                    )}

                    {!loading &&
                        forecast?.daily && (
                            <div className="forecast-page-grid">

                                {forecast.daily.time?.map(
                                    (date, index) => (
                                        <ForecastCard
                                            key={date}
                                            date={date}
                                            weatherCode={
                                                forecast
                                                    .daily
                                                    .weather_code?.[
                                                    index
                                                ]
                                            }
                                            max={
                                                forecast
                                                    .daily
                                                    .temperature_2m_max?.[
                                                    index
                                                ]
                                            }
                                            min={
                                                forecast
                                                    .daily
                                                    .temperature_2m_min?.[
                                                    index
                                                ]
                                            }
                                            precipitation={
                                                forecast
                                                    .daily
                                                    .precipitation_probability_max?.[
                                                    index
                                                ]
                                            }
                                        />
                                    )
                                )}

                            </div>
                        )}

                </div>

            </main>

        </div>
    );
}