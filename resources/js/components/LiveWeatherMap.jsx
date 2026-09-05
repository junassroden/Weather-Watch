import {
    useEffect,
    useMemo,
    useState,
} from "react";

import {
    MapContainer,
    TileLayer,
    Marker,
    Popup,
    useMap,
} from "react-leaflet";

import L from "leaflet";

import {
    Play,
    Pause,
    ChevronLeft,
    ChevronRight,
    LocateFixed,
    Radar,
    Layers,
    Satellite,
    LoaderCircle,
} from "lucide-react";

import {
    getRadarFrames,
    reverseLocation,
} from "../services/api";

import "leaflet/dist/leaflet.css";

const DEFAULT_VIEW = [20, 0];

const userIcon = L.divIcon({
    className: "weather-user-marker",
    html: `
        <div class="user-marker">
            <div class="user-marker-pulse"></div>
            <div class="user-marker-dot"></div>
        </div>
    `,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
});

function MapController({
    latitude,
    longitude,
}) {
    const map = useMap();

    useEffect(() => {
        if (
            typeof latitude === "number" &&
            typeof longitude === "number"
        ) {
            map.flyTo(
                [latitude, longitude],
                7,
                {
                    duration: 1.2,
                }
            );
        }
    }, [latitude, longitude, map]);

    return null;
}

function LocationController({
    onLocation,
}) {
    const map = useMap();

    const locate = () => {
        if (!navigator.geolocation) {
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const latitude =
                    position.coords.latitude;

                const longitude =
                    position.coords.longitude;

                map.flyTo(
                    [latitude, longitude],
                    7,
                    {
                        duration: 1.2,
                    }
                );

                onLocation(
                    latitude,
                    longitude
                );
            }
        );
    };

    return (
        <button
            className="map-control locate-control"
            onClick={locate}
            title="Use my location"
        >
            <LocateFixed size={18} />
        </button>
    );
}

export default function LiveWeatherMap({
    latitude: propLatitude = null,
    longitude: propLongitude = null,
}) {
    const [latitude, setLatitude] =
        useState(propLatitude);

    const [longitude, setLongitude] =
        useState(propLongitude);

    const [locationName, setLocationName] =
        useState("Locating your position...");

    const [frames, setFrames] =
        useState([]);

    const [currentFrame, setCurrentFrame] =
        useState(0);

    const [isPlaying, setIsPlaying] =
        useState(false);

    const [radarVisible, setRadarVisible] =
        useState(true);

    const [basemapVisible, setBasemapVisible] =
        useState(true);

    const [cloudAvailable, setCloudAvailable] =
        useState(false);

    const [loading, setLoading] =
        useState(true);

    const [locationLoading, setLocationLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    useEffect(() => {
        if (
            typeof propLatitude === "number" &&
            typeof propLongitude === "number"
        ) {
            setLatitude(propLatitude);
            setLongitude(propLongitude);

            setLocationLoading(false);

            reverseLocation(
                propLatitude,
                propLongitude
            )
                .then((location) => {
                    setLocationName(
                        location.city ||
                        location.display_name ||
                        "Current Location"
                    );
                })
                .catch(() => {
                    setLocationName(
                        "Current Location"
                    );
                });

            return;
        }

        if (!navigator.geolocation) {
            setLocationLoading(false);
            setLocationName(
                "Location unavailable"
            );
            return;
        }

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const currentLatitude =
                    position.coords.latitude;

                const currentLongitude =
                    position.coords.longitude;

                setLatitude(currentLatitude);
                setLongitude(currentLongitude);
                setLocationLoading(false);

                try {
                    const location =
                        await reverseLocation(
                            currentLatitude,
                            currentLongitude
                        );

                    setLocationName(
                        location.city ||
                        location.display_name ||
                        "Current Location"
                    );
                } catch {
                    setLocationName(
                        "Current Location"
                    );
                }
            },
            () => {
                setLocationLoading(false);
                setLocationName(
                    "Location unavailable"
                );
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 300000,
            }
        );
    }, [
        propLatitude,
        propLongitude,
    ]);

    useEffect(() => {
        async function loadRadar() {
            try {
                setLoading(true);
                setError("");

                const radar =
                    await getRadarFrames();

                const radarFrames =
                    radar.frames || [];

                setFrames(radarFrames);
                setCloudAvailable(
                    radar.cloud_imagery?.available === true
                );

                if (radarFrames.length > 0) {
                    setCurrentFrame(
                        radarFrames.length - 1
                    );
                }
            } catch {
                setError(
                    "Radar data unavailable."
                );
            } finally {
                setLoading(false);
            }
        }

        loadRadar();
    }, []);

    useEffect(() => {
        if (currentFrame >= frames.length) {
            setCurrentFrame(
                Math.max(frames.length - 1, 0)
            );
        }
    }, [currentFrame, frames.length]);

    useEffect(() => {
        if (
            !isPlaying ||
            frames.length < 2
        ) {
            return;
        }

        const interval = setInterval(() => {
            setCurrentFrame((previous) => {
                if (
                    previous >=
                    frames.length - 1
                ) {
                    return 0;
                }

                return previous + 1;
            });

        }, 900);

        return () => {
            clearInterval(interval);
        };
    }, [
        isPlaying,
        frames.length,
    ]);

    const activeFrame =
        frames[currentFrame];

    const radarUrl = useMemo(() => {
        if (!activeFrame) {
            return null;
        }

        return activeFrame.tile_url;
    }, [activeFrame]);

    const frameTime = useMemo(() => {
        if (!activeFrame) {
            return "No radar frame";
        }

        const date =
            new Date(
                activeFrame.time * 1000
            );

        return date.toLocaleString(
            [],
            {
                year: "numeric",
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
            }
        );
    }, [activeFrame]);

    const moveFrame = (direction) => {
        if (!frames.length) {
            return;
        }

        setIsPlaying(false);

        setCurrentFrame((previous) => {
            const next =
                previous + direction;

            if (next < 0) {
                return frames.length - 1;
            }

            if (
                next >= frames.length
            ) {
                return 0;
            }

            return next;
        });
    };

    const updateLocation = async (
        newLatitude,
        newLongitude
    ) => {
        setLatitude(newLatitude);
        setLongitude(newLongitude);

        try {
            const location =
                await reverseLocation(
                    newLatitude,
                    newLongitude
                );

            setLocationName(
                location.city ||
                location.display_name ||
                "Current Location"
            );
        } catch {
            setLocationName(
                "Current Location"
            );
        }
    };

    const hasLocation =
        typeof latitude === "number" &&
        typeof longitude === "number";

    return (
        <section className="live-map-section">

            <div className="live-map-header">

                <div>
                    <div className="map-eyebrow">
                        LIVE WEATHER WATCH
                    </div>

                    <h2>
                        Precipitation Radar
                    </h2>

                    <p>
                        {locationLoading
                            ? "Determining your current location..."
                            : locationName}
                    </p>
                </div>

                <div className="map-status">

                    <span className="status-dot"></span>

                    <span>
                        {isPlaying
                            ? "Live radar loop"
                            : loading
                            ? "Loading"
                            : "Radar online"}
                    </span>

                </div>

            </div>

            <div className="live-map-wrapper">

                <MapContainer
                    center={
                        hasLocation
                            ? [
                                latitude,
                                longitude,
                            ]
                            : DEFAULT_VIEW
                    }
                    zoom={
                        hasLocation
                            ? 7
                            : 2
                    }
                    minZoom={2}
                    maxZoom={7}
                    scrollWheelZoom={true}
                    zoomControl={true}
                    className="live-weather-map"
                >

                    {basemapVisible && (
                        <TileLayer
                            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                            maxZoom={7}
                            attribution="Satellite basemap &copy; Esri"
                        />
                    )}

                    {radarVisible &&
                        radarUrl && (
                            <TileLayer
                                key={radarUrl}
                                url={radarUrl}
                                opacity={0.72}
                                maxZoom={7}
                                attribution="Weather radar by RainViewer"
                            />
                        )}

                    {hasLocation && (
                        <>
                            <Marker
                                position={[
                                    latitude,
                                    longitude,
                                ]}
                                icon={userIcon}
                            >
                                <Popup>
                                    <strong>
                                        Your Location
                                    </strong>
                                    <br />
                                    {locationName}
                                    <br />
                                    {latitude.toFixed(4)},{" "}
                                    {longitude.toFixed(4)}
                                </Popup>
                            </Marker>

                            <MapController
                                latitude={latitude}
                                longitude={longitude}
                            />
                        </>
                    )}

                    <LocationController
                        onLocation={
                            updateLocation
                        }
                    />

                </MapContainer>

                <div className="map-top-controls">

                    <button
                        className={
                            radarVisible
                                ? "map-control active"
                                : "map-control"
                        }
                        onClick={() =>
                            setRadarVisible(
                                !radarVisible
                            )
                        }
                        title="Toggle radar"
                    >
                        <Radar size={18} />
                    </button>

                    <button
                        className={
                            basemapVisible
                                ? "map-control active"
                                : "map-control"
                        }
                        onClick={() =>
                            setBasemapVisible(
                                !basemapVisible
                            )
                        }
                        title="Toggle satellite basemap"
                    >
                        {basemapVisible ? (
                            <Satellite size={18} />
                        ) : (
                            <Layers size={18} />
                        )}
                    </button>

                    {!cloudAvailable && (
                        <span className="map-layer-status">
                            CLOUD SATELLITE UNAVAILABLE
                        </span>
                    )}

                </div>

                {loading && (
                    <div className="map-loading">

                        <LoaderCircle
                            size={22}
                            className="spin"
                        />

                        <span>
                            Loading radar data
                        </span>

                    </div>
                )}

                {error && (
                    <div className="map-error">
                        {error}
                    </div>
                )}

                <div className="map-overlay">

                    <div className="radar-frame-info">

                        <span className="radar-label">
                            RADAR CAPTURE TIME
                        </span>

                        <strong>
                            {frameTime}
                        </strong>

                    </div>

                    <div className="timeline">

                        <button
                            onClick={() =>
                                moveFrame(-1)
                            }
                            disabled={
                                frames.length < 2
                            }
                        >
                            <ChevronLeft
                                size={18}
                            />
                        </button>

                        <button
                            className="play-button"
                            onClick={() =>
                                setIsPlaying(
                                    (playing) => !playing
                                )
                            }
                            disabled={
                                frames.length < 2
                            }
                        >
                            {isPlaying ? (
                                <>
                                    <Pause size={17} />
                                    <span>Stop</span>
                                </>
                            ) : (
                                <>
                                    <Play size={17} />
                                    <span>Play live</span>
                                </>
                            )}
                        </button>

                        <div className="timeline-track">

                            <input
                                type="range"
                                min="0"
                                max={Math.max(
                                    frames.length - 1,
                                    0
                                )}
                                value={
                                    currentFrame
                                }
                                onChange={(event) => {
                                    setIsPlaying(false);

                                    setCurrentFrame(
                                        Number(
                                            event.target.value
                                        )
                                    );
                                }}
                                disabled={
                                    frames.length < 2
                                }
                            />

                            <div className="timeline-labels">

                                <span>
                                    Past
                                </span>

                                <span>
                                    {frames.length
                                        ? `${currentFrame + 1} / ${frames.length}`
                                        : "No frames"}
                                </span>

                                <span>
                                    Latest
                                </span>

                            </div>

                        </div>

                        <button
                            onClick={() =>
                                moveFrame(1)
                            }
                            disabled={
                                frames.length < 2
                            }
                        >
                            <ChevronRight
                                size={18}
                            />
                        </button>

                    </div>

                </div>

                <div className="map-attribution">
                    Radar data by{" "}
                    <a
                        href="https://www.rainviewer.com/"
                        target="_blank"
                        rel="noreferrer"
                    >
                        RainViewer
                    </a>
                </div>

            </div>

            <div className="map-footer-info">

                <div>
                    <span>LOCATION</span>

                    <strong>
                        {locationName}
                    </strong>
                </div>

                <div>
                    <span>COORDINATES</span>

                    <strong>
                        {hasLocation
                            ? `${latitude.toFixed(
                                4
                            )}, ${longitude.toFixed(
                                4
                            )}`
                            : "Unavailable"}
                    </strong>
                </div>

                <div>
                    <span>RADAR FRAMES</span>

                    <strong>
                        {frames.length || 0}
                    </strong>
                </div>

                <div>
                    <span>DATA TYPE</span>

                    <strong>
                        Past Radar
                    </strong>
                </div>

            </div>

        </section>
    );
};