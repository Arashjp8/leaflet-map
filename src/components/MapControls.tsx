import Button from "./Button";

interface MapControlsProps {
    onFindLocation: () => void;
    onResetView: () => void;
    isLoading: boolean;
}

export function MapControls({ onFindLocation, onResetView, isLoading }: MapControlsProps) {
    return (
        <div className="absolute z-10 top-4 right-4">
            <div className="flex gap-2">
                <Button variant="contained" size="small" onClick={onFindLocation} loading={isLoading}>
                    Find My Location
                </Button>
                <Button variant="contained" size="small" onClick={onResetView}>
                    Reset View
                </Button>
            </div>
        </div>
    );
}
