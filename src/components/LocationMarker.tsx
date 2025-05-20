import { useEffect, useRef, useState } from "react";
import { Marker, Popup, Tooltip, useMapEvents } from "react-leaflet";
import type { Map as LeafletMap } from "leaflet";

interface IPosition {
    lat: number;
    lng: number;
}

interface LocationMarkerProps {
    findLocationTrigger: number;
    onLoadingChange: (isLoading: boolean) => void;
    onErrorChange: (error: string | null) => void;
    timeout?: number;
    maxRetries?: number;
    retryDelay?: number;
}

export function LocationMarker({
    findLocationTrigger,
    onLoadingChange,
    onErrorChange,
    timeout = 3000,
    maxRetries = 3,
    retryDelay = 3000,
}: LocationMarkerProps) {
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
            if (retryCount < maxRetries) {
                setRetryCount(retryCount + 1);
                const errorMsg = `Location acquisition timed out. Retrying... (${retryCount + 1}/${maxRetries})`;
                onErrorChange(errorMsg);
                retryTimeoutRef.current = setTimeout(() => {
                    onLoadingChange(true);
                    map.locate();
                }, retryDelay);
            } else {
                const errorMsg = `${e.message} (Max retries reached)`;
                onLoadingChange(false);
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
            map.locate({ timeout }); // 3 second timeout by default
        }
    }, [findLocationTrigger, map, onErrorChange, onLoadingChange, timeout]);

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
