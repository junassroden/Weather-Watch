import { useEffect, useRef, useState } from "react";
import {
    Layers,
    LocateFixed,
    Minus,
    Pause,
    Play,
    Plus,
    Satellite
} from "lucide-react";

function LiveWeatherMap() {
    const mapRef = useRef(null);
    const leafletMap = useRef(null);
    const userMarker = useRef(null);

    const [location, setLocation] = useState(null);
    const [locationStatus, setLocationStatus] = useState("locating");
    const [playing, setPlaying] = useState(false);

    useEffect(() => {
        let mounted = true;

        const loadMap = async () => {
            const L = await import("leaflet");
            await import("leaflet/dist/leaflet.css");

            if (!mounted || !mapRef.current || leafletMap.current) {
                return;
            }

            const map = L.map(mapRef.current, {
                zoomControl: false,
                attributionControl: true
            }).setView([20, 0], 2);

            leafletMap.current = map;

            L.tileLayer(
                "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
                {
                    maxZoom: 18,
                    attribution:
                        "Tiles © Esri"
                }
            ).addTo(map);

            requestLocation(L);
        };

        loadMap();

        return () => {
            mounted = false;

            if (leafletMap.current) {
                leafletMap.current.remove();
                leafletMap.current = null;
            }
        };
    }, []);

    const requestLocation = async (L = null) => {
        const leaflet = L || await import("leaflet");

        if (!navigator.geolocation) {
            setLocationStatus("unavailable");
            return;
        }

        setLocationStatus("locating");

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const lat = position.coords.latitude;
                const lng = position.coords.longitude;

                setLocation({
                    lat,
                    lng
                });

                setLocationStatus("available");

                if (leafletMap.current) {
                    leafletMap.current.setView([lat, lng], 11);

                    if (userMarker.current) {
                        userMarker.current.remove();
                    }

                    const icon = leaflet.divIcon({
                        className: "weatherwatch-location-marker",
                        html: `
                            <div class="location-pulse">
                                <div class="location-dot"></div>
                            </div>
                        `,
                        iconSize: [30, 30],
                        iconAnchor: [15, 15]
                    });

                    userMarker.current = leaflet
                        .marker([lat, lng], { icon })
                        .addTo(leafletMap.current);
                }
            },
            () => {
                setLocationStatus("denied");
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 300000
            }
        );
    };

    const zoomIn = () => {
        leafletMap.current?.zoomIn();
    };

    const zoomOut = () => {
        leafletMap.current?.zoomOut();
    };

    const centerLocation = async () => {
        await requestLocation();
    };

    return (
        <section className="live-map-section" id="satellite">
            <div className="map-heading">
                <div>
                    <div className="section-kicker">
                        <span className="live-dot"></span>
                        LIVE MONITORING
                    </div>

                    <h2>Live Weather Watch</h2>

                    <p>
                        Observe your surroundings through satellite imagery
                        and monitor developing weather conditions.
                    </p>
                </div>

                <div className="map-status">
                    <Satellite size={17} />
                    Satellite View
                </div>
            </div>

            <div className="weather-map-wrapper">
                <div
                    ref={mapRef}
                    className="weather-map"
                />

                <div className="map-overlay-top">
                    <div className="map-location-status">
                        <LocateFixed size={15} />

                        {locationStatus === "locating" &&
                            "Finding your location..."}

                        {locationStatus === "available" &&
                            "Your current location"}

                        {locationStatus === "denied" &&
                            "Location unavailable"}

                        {locationStatus === "unavailable" &&
                            "Location not supported"}
                    </div>

                    <div className="map-layer-button">
                        <Layers size={16} />
                        Layers
                    </div>
                </div>

                <div className="map-overlay-bottom">
                    <div className="map-time">
                        <span>WEATHERWATCH</span>
                        <strong>Live satellite imagery</strong>
                    </div>

                    <div className="map-timeline">
                        <button
                            className="timeline-button"
                            onClick={() => setPlaying(!playing)}
                        >
                            {playing ? (
                                <Pause size={16} />
                            ) : (
                                <Play size={16} />
                            )}
                        </button>

                        <div className="timeline-track">
                            <div className="timeline-progress"></div>
                        </div>

                        <span className="timeline-time">
                            LIVE
                        </span>
                    </div>
                </div>

                <div className="map-controls">
                    <button
                        onClick={zoomIn}
                        aria-label="Zoom in"
                    >
                        <Plus size={19} />
                    </button>

                    <button
                        onClick={zoomOut}
                        aria-label="Zoom out"
                    >
                        <Minus size={19} />
                    </button>

                    <button
                        onClick={centerLocation}
                        aria-label="Use my location"
                    >
                        <LocateFixed size={18} />
                    </button>
                </div>

                {location && (
                    <div className="coordinates-display">
                        {location.lat.toFixed(4)}°,{" "}
                        {location.lng.toFixed(4)}°
                    </div>
                )}
            </div>
        </section>
    );
}

export default LiveWeatherMap;