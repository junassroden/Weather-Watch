import axios from "axios";

const api = axios.create({
    baseURL: "/api",
    headers: {
        Accept: "application/json",
    },
});

/**
 * Every function below now accepts an optional `{ signal }` (an
 * AbortSignal) as its last argument. This is what lets calling code
 * cancel an in-flight request - e.g. when the user picks a new location
 * before the previous location's weather/forecast/reverse-geocode
 * requests have resolved, so an older, slower response can never
 * overwrite a newer one.
 *
 * Typical usage from a component/hook:
 *
 *   const controller = new AbortController();
 *   getCurrentWeather(lat, lon, { signal: controller.signal })
 *     .then(setWeather)
 *     .catch((err) => {
 *       if (axios.isCancel(err) || err.name === "CanceledError") return;
 *       setWeatherError(err);
 *     });
 *   // ...if the location changes again:
 *   controller.abort();
 *
 * Note: this file only covers the API layer. The actual
 * geolocation -> parallel fetch -> render sequencing lives in the React
 * components/hooks that call these functions, which were not part of
 * the uploaded files, so that wiring still needs to be done/reviewed on
 * your end (see the accompanying message for what to check there).
 */

export async function getCurrentWeather(latitude, longitude, { signal } = {}) {
    const response = await api.get("/weather/current", {
        params: {
            latitude,
            longitude,
        },
        signal,
    });

    return response.data.data;
}

export async function getForecast(latitude, longitude, { signal } = {}) {
    const response = await api.get("/weather/forecast", {
        params: {
            latitude,
            longitude,
        },
        signal,
    });

    return response.data.data;
}

export async function getRisk(latitude, longitude, { signal } = {}) {
    const response = await api.get("/weather/risk", {
        params: {
            latitude,
            longitude,
        },
        signal,
    });

    return response.data.data;
}

export async function getAlerts(latitude, longitude, { signal } = {}) {
    const response = await api.get("/weather/alerts", {
        params: {
            latitude,
            longitude,
        },
        signal,
    });

    return response.data.data;
}

export async function searchLocation(query, { signal } = {}) {
    const response = await api.get("/location/search", {
        params: {
            q: query,
        },
        signal,
    });

    return response.data.data;
}

export async function reverseLocation(latitude, longitude, { signal } = {}) {
    const response = await api.get("/location/reverse", {
        params: {
            latitude,
            longitude,
        },
        signal,
    });

    return response.data.data;
}

export async function getRadarFrames({ signal } = {}) {
    const response = await api.get("/satellite/frames", { signal });

    return response.data.data;
}