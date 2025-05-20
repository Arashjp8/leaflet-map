import { MapContainer, Marker, Popup, TileLayer, Tooltip, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useRef, useState } from "react";
import type { Map as LeafletMap } from "leaflet";
import Button from "./components/Button";

interface IPosition {
    lat: number;
    lng: number;
}

const MAX_RETRIES = 3;
const RETRY_DELAY = 3000;

interface LocationMarkerProps {
    findLocationTrigger: number;
    onLoadingChange: (isLoading: boolean) => void;
    onErrorChange: (error: string | null) => void;
}

function LocationMarker({ findLocationTrigger, onLoadingChange, onErrorChange }: LocationMarkerProps) {
    const [position, setPosition] = useState<IPosition | null>(null);
    const [retryCount, setRetryCount] = useState(0);
    const mapRef = useRef<LeafletMap | null>(null);

    const retryTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    const map = useMapEvents({
        locationfound(e) {
            if (retryTimeoutRef.current) {
                clearTimeout(retryTimeoutRef.current);
            }
            setPosition(e.latlng);
            onLoadingChange(false);
            onErrorChange(null);
            map.flyTo(e.latlng, map.getZoom());
        },
        locationerror(e) {
            onLoadingChange(false);
            if (retryCount < MAX_RETRIES) {
                setRetryCount(retryCount + 1);
                const errorMsg = `Location acquisition timed out. Retrying... (${retryCount + 1}/${MAX_RETRIES})`;
                onErrorChange(errorMsg);
                retryTimeoutRef.current = setTimeout(() => {
                    onLoadingChange(true);
                    map.locate();
                }, RETRY_DELAY);
            } else {
                const errorMsg = `Geolocation error: ${e.message} (Max retries reached)`;
                onErrorChange(errorMsg);
                setRetryCount(0);
                setPosition(null);
            }
        },
    });

    useEffect(() => {
        mapRef.current = map;
    }, [map]);

    useEffect(() => {
        if (findLocationTrigger > 0) {
            if (retryTimeoutRef.current) {
                clearTimeout(retryTimeoutRef.current);
            }
            onErrorChange(null);
            onLoadingChange(true);
            map.locate({ timeout: 3000 }); // 3 second timeout
        }
    }, [findLocationTrigger, map, onErrorChange, onLoadingChange]);

    useEffect(() => {
        console.log("position:", position);
    }, [position]);

    return (
        <>
            {position && (
                <Marker position={position}>
                    <Popup>You are here</Popup>
                    <Tooltip>You are here</Tooltip>
                </Marker>
            )}
        </>
    );
}

function App() {
    const [findLocationTrigger, setFindLocationTrigger] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleFindLocation = () => {
        setFindLocationTrigger((prev) => prev + 1);
    };

    useEffect(() => {
        console.log("loading:", isLoading);
        console.log("error:", error);
    }, [isLoading, error]);

    return (
        <div className="w-screen h-screen">
            <div className="absolute z-10 top-4 right-4">
                <div className="flex gap-2">
                    <Button variant="contained" size="small" onClick={handleFindLocation} loading={isLoading}>
                        Find My Location
                    </Button>
                    <Button variant="contained" size="small">
                        Reset View
                    </Button>
                </div>
            </div>
            {error && (
                <div className="absolute z-10 top-16 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded">
                    {error}
                </div>
            )}
            <MapContainer
                center={[35.6892, 51.389]}
                zoom={11}
                scrollWheelZoom={false}
                className="absolute w-full h-full z-0"
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
