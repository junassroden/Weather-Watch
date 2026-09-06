import React from "react";
import ReactDOM from "react-dom/client";
import {
    BrowserRouter,
    useLocation,
    Routes,
    Route,
} from "react-router-dom";

import {
    useLayoutEffect,
} from "react";

import Dashboard from "./pages/Dashboard";
import Forecast from "./pages/Forecast";
import SatelliteRadar from "./pages/SatelliteRadar";
import WeatherHistory from "./pages/WeatherHistory";
import AlertsSafety from "./pages/AlertsSafety";

import "./app.css";

function ScrollToTop() {
    const { pathname } = useLocation();

    useLayoutEffect(() => {
        window.scrollTo({
            top: 0,
            left: 0,
            behavior: "auto",
        });
    }, [pathname]);

    return null;
}

function App() {
    return (
        <BrowserRouter>
            <ScrollToTop />

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