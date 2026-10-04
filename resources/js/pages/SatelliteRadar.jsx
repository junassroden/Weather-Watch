import { useEffect, useMemo, useState } from "react";
import { CircleMarker, MapContainer, TileLayer, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Crosshair, Layers3, Pause, Play, SkipBack, SkipForward } from "lucide-react";
import AppHeader from "../components/AppHeader";
import useWeather from "../hooks/useWeather";
import { getRadarFrames } from "../services/api";

function Recenter({ coords }) {
    const map = useMap();
    useEffect(() => {
        if (coords?.latitude != null) map.flyTo([coords.latitude, coords.longitude], Math.max(map.getZoom(), 7), { duration: 1.2 });
    }, [coords?.latitude, coords?.longitude, map]);
    return null;
}

export default function SatelliteRadar() {
    const state = useWeather();
    const { coords, locationName, selectLocation, useCurrentLocation } = state;
    const [radar, setRadar] = useState(null);
    const [frame, setFrame] = useState(0);
    const [playing, setPlaying] = useState(false);
    const [speed, setSpeed] = useState(900);
    const [showRadar, setShowRadar] = useState(true);

    useEffect(() => {
        let active = true;

        getRadarFrames()
            .then((data) => {
                if (!active) return;
                setRadar(data);
                setFrame(Math.max(0, (data.frames?.length || 1) - 1));
            })
            .catch(() => {
                if (active) setRadar(null);
            });

        return () => {
            active = false;
        };
    }, []);

    useEffect(() => {
        if (!playing || !radar?.frames?.length) return;
        const timer = setInterval(() => setFrame((value) => (value + 1) % radar.frames.length), speed);
        return () => clearInterval(timer);
    }, [playing, radar, speed]);

    const activeFrame = radar?.frames?.[frame];
    const timestamp = useMemo(() => activeFrame?.time ? new Date(activeFrame.time * 1000).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }) : "--", [activeFrame]);
    const hasRadarFrames = (radar?.frames?.length ?? 0) > 0;

    return (
        <div className="ww-app-shell ww-radar-shell">
            <AppHeader onLocationSelect={selectLocation} onUseLocation={useCurrentLocation} />
            <main className="ww-radar-page">
                <div className="ww-radar-map-wrap">
                    <MapContainer center={[coords?.latitude ?? 13.41, coords?.longitude ?? 121.18]} zoom={7} minZoom={3} maxZoom={12} className="ww-radar-map" zoomControl={false}>
                        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="&copy; OpenStreetMap contributors" />
                        {showRadar && activeFrame?.tile_url && <TileLayer key={activeFrame.tile_url} url={activeFrame.tile_url} opacity={0.72} maxNativeZoom={7} zIndex={450} />}
                        <CircleMarker center={[coords?.latitude ?? 13.41, coords?.longitude ?? 121.18]} radius={6} pathOptions={{ color: "#83CFFF", fillColor: "#2389D7", fillOpacity: 1, weight: 2 }} />
                        <Recenter coords={coords} />
                    </MapContainer>
                    <div className="ww-radar-depth" aria-hidden="true" />

                    <div className="ww-radar-title">
                        <span className="ww-eyebrow">LIVE PRECIPITATION RADAR</span>
                        <h1>{locationName}</h1>
                        <p>Atmospheric precipitation layers rendered over the current region.</p>
                    </div>

                    <div className="ww-radar-controls-floating">
                        <button onClick={useCurrentLocation}><Crosshair size={17} /> Center</button>
                        <button className={showRadar ? "is-active" : ""} onClick={() => setShowRadar((v) => !v)} disabled={!hasRadarFrames}><Layers3 size={17} /> Precipitation</button>
                    </div>

                    {!hasRadarFrames && <div className="ww-inline-alert" role="alert">RainViewer radar data is temporarily unavailable. Please try again shortly.</div>}

                    <div className="ww-radar-legend">
                        <span>LIGHT</span><i /><i /><i /><i /><i /><span>HEAVY</span>
                    </div>

                    <div className="ww-radar-timeline">
                        <div className="ww-playback-controls">
                            <button onClick={() => setFrame((v) => Math.max(0, v - 1))} aria-label="Previous radar frame"><SkipBack size={18} /></button>
                            <button className="ww-play-button" onClick={() => setPlaying((v) => !v)} aria-label={playing ? "Pause radar" : "Play radar"}>{playing ? <Pause size={19} /> : <Play size={19} />}</button>
                            <button onClick={() => setFrame((v) => Math.min((radar?.frames?.length || 1) - 1, v + 1))} aria-label="Next radar frame"><SkipForward size={18} /></button>
                        </div>
                        <div className="ww-timeline-track">
                            <div className="ww-timeline-labels"><span>PAST</span><strong>{timestamp}</strong><span>NOW</span></div>
                            <input type="range" min="0" max={Math.max(0, (radar?.frames?.length || 1) - 1)} value={frame} onChange={(e) => setFrame(Number(e.target.value))} aria-label="Radar timeline" />
                        </div>
                        <button className="ww-speed-button" onClick={() => setSpeed((v) => v === 900 ? 500 : v === 500 ? 1300 : 900)}>{speed === 500 ? "2×" : speed === 900 ? "1×" : "0.5×"}</button>
                    </div>
                </div>
            </main>
        </div>
    );
}
