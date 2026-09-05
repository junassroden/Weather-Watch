import React from "react";
import ReactDOM from "react-dom/client";
import {
    BrowserRouter,
    Routes,
    Route,
} from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import Forecast from "./pages/Forecast";
import SatelliteRadar from "./pages/SatelliteRadar";
import WeatherHistory from "./pages/WeatherHistory";
import AlertsSafety from "./pages/AlertsSafety";

import "./app.css";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route
                    path="/"
                    element={<Dashboard />}
                />

                <Route
                    path="/forecast"
                    element={<Forecast />}
                />

                <Route
                    path="/satellite-radar"
                    element={<SatelliteRadar />}
                />

                <Route
                    path="/weather-history"
                    element={<WeatherHistory />}
                />

                <Route
                    path="/alerts"
                    element={<AlertsSafety />}
                />
            </Routes>
        </BrowserRouter>
    );
}

ReactDOM.createRoot(
    document.getElementById("app")
).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);