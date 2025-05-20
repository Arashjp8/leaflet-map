import { useRef, useCallback } from "react";
import type { Map as LeafletMap } from "leaflet";

interface UseMapControlProps {
    initialCenter: [number, number];
    initialZoom: number;
}

export function useMapControl({ initialCenter, initialZoom }: UseMapControlProps) {
    const mapRef = useRef<LeafletMap | null>(null);

    const handleMapReady = useCallback((map: LeafletMap) => {
        mapRef.current = map;
    }, []);

    const resetView = useCallback(() => {
        if (mapRef.current) {
            mapRef.current.setView(initialCenter, initialZoom);
        }
    }, [initialCenter, initialZoom]);

    return {
        mapRef,
        handleMapReady,
        resetView,
    };
}
