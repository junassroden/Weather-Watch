import React, { useEffect } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Navigate, Route, Routes, useLocation } from "react-router-dom";
import "../css/app.css";
import Dashboard from "./pages/Dashboard";
import Forecast from "./pages/Forecast";
import SatelliteRadar from "./pages/SatelliteRadar";
import AlertsSafety from "./pages/AlertsSafety";
import Locations from "./pages/Locations";

function ScrollToTop() {
    const { pathname } = useLocation();
    useEffect(() => {
        window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    }, [pathname]);
    return null;
}

function App() {
    return (
        <BrowserRouter>
            <ScrollToTop />
            <Routes>
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/current-weather" element={<Navigate to="/dashboard" replace />} />
                <Route path="/forecast" element={<Forecast />} />
                <Route path="/satellite-radar" element={<SatelliteRadar />} />
                <Route path="/radar" element={<Navigate to="/satellite-radar" replace />} />
                <Route path="/alerts" element={<AlertsSafety />} />
                <Route path="/locations" element={<Locations />} />
                <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
        </BrowserRouter>
    );
}

ReactDOM.createRoot(document.getElementById("app")).render(<React.StrictMode><App /></React.StrictMode>);
