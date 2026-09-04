import axios from "axios";

const api = axios.create({
    baseURL: "/api",
    headers: {
        Accept: "application/json",
    },
});

export async function getCurrentWeather(latitude, longitude) {
    const response = await api.get("/weather/current", {
        params: {
            latitude,
            longitude,
        },
    });

    return response.data.data;
}

export async function getForecast(latitude, longitude) {
    const response = await api.get("/weather/forecast", {
        params: {
            latitude,
            longitude,
        },
    });

    return response.data.data;
}

export async function getRisk(latitude, longitude) {
    const response = await api.get("/weather/risk", {
        params: {
            latitude,
            longitude,
        },
    });

    return response.data.data;
}

export async function getAlerts(latitude, longitude) {
    const response = await api.get("/weather/alerts", {
        params: {
            latitude,
            longitude,
        },
    });

    return response.data.data;
}

export async function searchLocation(query) {
    const response = await api.get("/location/search", {
        params: {
            q: query,
        },
    });

    return response.data.data;
}

export async function reverseLocation(latitude, longitude) {
    const response = await api.get("/location/reverse", {
        params: {
            latitude,
            longitude,
        },
    });

    return response.data.data;
}

export async function getRadarFrames() {
    const response = await api.get("/satellite/frames");

    return response.data.data;
}