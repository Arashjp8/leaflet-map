import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useRef, useState } from "react";
import { LocationMarker } from "./components/LocationMarker";
import { MapControls } from "./components/MapControls";
import { ErrorMessage } from "./components/ErrorMessage";
import type { Map as LeafletMap } from "leaflet";

function App() {
    const [findLocationTrigger, setFindLocationTrigger] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const mapRef = useRef<LeafletMap | null>(null);
    const initialCenter = [35.6892, 51.389] as [number, number];
    const initialZoom = 11;

    const handleFindLocation = () => {
        setFindLocationTrigger((prev) => prev + 1);
    };

    const handleResetView = () => {
        if (mapRef.current) {
            mapRef.current.setView(initialCenter, initialZoom);
        }
    };

    const handleMapReady = (map: LeafletMap) => {
        mapRef.current = map;
    };

    useEffect(() => {
        console.log("loading:", isLoading);
        console.log("error:", error);
    }, [isLoading, error]);

    return (
        <div className="w-screen h-screen">
            <MapControls onFindLocation={handleFindLocation} onResetView={handleResetView} isLoading={isLoading} />
            <ErrorMessage error={error} />
            <MapContainer
                center={initialCenter}
                zoom={initialZoom}
                scrollWheelZoom={false}
                className="absolute w-full h-full z-0"
                ref={handleMapReady}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <LocationMarker
                    findLocationTrigger={findLocationTrigger}
                    onLoadingChange={setIsLoading}
                    onErrorChange={setError}
                />
            </MapContainer>
        </div>
    );
}

export default App;
