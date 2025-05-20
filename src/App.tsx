import { MapContainer, Marker, Popup, TileLayer, Tooltip, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useRef, useState } from "react";

interface IPosition {
    lat: number;
    lng: number;
}

const MAX_RETRIES = 3;
const RETRY_DELAY = 3000;

function LocationMarker() {
    const [position, setPosition] = useState<IPosition | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [retryCount, setRetryCount] = useState(0);

    const retryTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    const map = useMapEvents({
        click() {
            if (!position) {
                if (retryTimeoutRef.current) {
                    clearTimeout(retryTimeoutRef.current);
                }
                setError(null);
                setLoading(true);
                map.locate({ timeout: 3000 }); // 3 second timeout
            }
        },
        locationfound(e) {
            if (retryTimeoutRef.current) {
                clearTimeout(retryTimeoutRef.current);
            }
            setPosition(e.latlng);
            setLoading(false);
            map.flyTo(e.latlng, map.getZoom());
        },
        locationerror(e) {
            setLoading(false);
            if (retryCount < MAX_RETRIES) {
                setRetryCount(retryCount + 1);
                setError(`Location acquisition timed out. Retrying... (${retryCount + 1}/${MAX_RETRIES})`);
                retryTimeoutRef.current = setTimeout(() => {
                    setLoading(true);
                    map.locate();
                }, RETRY_DELAY);
            } else {
                setError(`Geolocation error: ${e.message} (Max retries reached)`);
                setRetryCount(0);
                setPosition(null);
            }
        },
    });

    useEffect(() => {
        console.log("position:", position);
        console.log("loading:", loading);
        console.log("error:", error);
    }, [position, loading, error]);

    return (
        <>
            {/* {loading && <div className="location-feedback">Finding your location...</div>} */}
            {/* {error && <div className="location-feedback error">{error}</div>} */}
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
    return (
        <div className="w-screen h-screen">
            <MapContainer center={[35.6892, 51.389]} zoom={11} scrollWheelZoom={false} className="w-full h-full">
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <LocationMarker />
            </MapContainer>
        </div>
    );
}

export default App;
