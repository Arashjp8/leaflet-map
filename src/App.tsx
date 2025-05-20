import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { LocationMarker } from "./components/LocationMarker";
import { MapControls } from "./components/MapControls";
import { ErrorMessage } from "./components/ErrorMessage";
import { useMapLocation } from "./hooks/useMapLocation";
import { useMapControl } from "./hooks/useMapControl";

function App() {
    const initialCenter = [35.6892, 51.389] as [number, number];
    const initialZoom = 11;

    const { isLoading, error, findLocationTrigger, findMyLocation, handleLoadingChange, handleErrorChange } =
        useMapLocation();
    const { handleMapReady, resetView } = useMapControl({ initialCenter, initialZoom });

    return (
        <div className="w-screen h-screen">
            <MapControls onFindLocation={findMyLocation} onResetView={resetView} isLoading={isLoading} />
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
                    onLoadingChange={handleLoadingChange}
                    onErrorChange={handleErrorChange}
                />
            </MapContainer>
        </div>
    );
}

export default App;
