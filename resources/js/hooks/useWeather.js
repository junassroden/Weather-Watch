import { useCallback, useEffect, useRef, useState } from "react";
import { getAlerts, getCurrentWeather, getForecast, getRisk, reverseLocation } from "../services/api";

const FALLBACK = { latitude: 13.4108, longitude: 121.1803, name: "Calapan City", detail: "Oriental Mindoro, Philippines" };

export default function useWeather({ autoLocate = true } = {}) {
    const [locationName, setLocationName] = useState(FALLBACK.name);
    const [locationDetail, setLocationDetail] = useState(FALLBACK.detail);
    const [coords, setCoords] = useState(FALLBACK);
    const [weather, setWeather] = useState(null);
    const [forecast, setForecast] = useState(null);
    const [risk, setRisk] = useState(null);
    const [alerts, setAlerts] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const controllerRef = useRef(null);
    const requestRef = useRef(0);

    const loadWeather = useCallback(async (latitude, longitude, meta = {}) => {
        controllerRef.current?.abort();
        const controller = new AbortController();
        controllerRef.current = controller;
        const id = ++requestRef.current;
        setLoading(true);
        setError(meta.error || "");
        setCoords({ latitude, longitude });
        if (meta.name) setLocationName(meta.name);
        if (meta.detail != null) setLocationDetail(meta.detail);

        const results = await Promise.allSettled([
            getCurrentWeather(latitude, longitude, { signal: controller.signal }),
            getForecast(latitude, longitude, { signal: controller.signal }),
            getRisk(latitude, longitude, { signal: controller.signal }),
            getAlerts(latitude, longitude, { signal: controller.signal }),
            reverseLocation(latitude, longitude, { signal: controller.signal }),
        ]);

        if (id !== requestRef.current) return;
        const [weatherResult, forecastResult, riskResult, alertsResult, locationResult] = results;

        if (weatherResult.status === "fulfilled") setWeather(weatherResult.value);
        if (forecastResult.status === "fulfilled") setForecast(forecastResult.value);
        setRisk(riskResult.status === "fulfilled" ? riskResult.value : null);
        setAlerts(alertsResult.status === "fulfilled" ? alertsResult.value : null);

        if (locationResult.status === "fulfilled" && !meta.name) {
            const location = locationResult.value;
            setLocationName(location.locality || location.city || "Current location");
            setLocationDetail([location.city !== location.locality ? location.city : null, location.province, location.country].filter(Boolean).join(", "));
        }

        if (weatherResult.status === "rejected") {
            setError("Weather-model data could not be loaded. Please try again.");
        }
        setLoading(false);
    }, []);

    const useCurrentLocation = useCallback(() => {
        if (!navigator.geolocation) {
            loadWeather(FALLBACK.latitude, FALLBACK.longitude, {
                name: FALLBACK.name,
                detail: FALLBACK.detail,
                error: `Your location could not be detected. Showing weather for ${FALLBACK.name}; allow location access or search for your city.`,
            });
            return;
        }
        setLoading(true);
        navigator.geolocation.getCurrentPosition(
            ({ coords: c }) => loadWeather(c.latitude, c.longitude),
            () => loadWeather(FALLBACK.latitude, FALLBACK.longitude, {
                name: FALLBACK.name,
                detail: FALLBACK.detail,
                error: `Your location could not be detected. Showing weather for ${FALLBACK.name}; allow location access or search for your city.`,
            }),
            { enableHighAccuracy: true, timeout: 9000, maximumAge: 300000 },
        );
    }, [loadWeather]);

    const selectLocation = useCallback((result) => {
        loadWeather(Number(result.latitude), Number(result.longitude), {
            name: result.name,
            detail: [result.admin1, result.country].filter(Boolean).join(", "),
        });
    }, [loadWeather]);

    useEffect(() => {
        if (autoLocate) useCurrentLocation();
        else loadWeather(FALLBACK.latitude, FALLBACK.longitude, { name: FALLBACK.name, detail: FALLBACK.detail });
        return () => controllerRef.current?.abort();
    }, [autoLocate, loadWeather, useCurrentLocation]);

    return { locationName, locationDetail, coords, weather, forecast, risk, alerts, loading, error, loadWeather, useCurrentLocation, selectLocation };
}
