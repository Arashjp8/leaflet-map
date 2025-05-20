import { useCallback, useState } from "react";

interface UseMapLocationReturn {
    isLoading: boolean;
    error: string | null;
    findLocationTrigger: number;
    findMyLocation: () => void;
    handleLoadingChange: (isLoading: boolean) => void;
    handleErrorChange: (error: string | null) => void;
}

export function useMapLocation(): UseMapLocationReturn {
    const [findLocationTrigger, setFindLocationTrigger] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const findMyLocation = useCallback(() => {
        setFindLocationTrigger((prev) => prev + 1);
    }, []);

    const handleLoadingChange = useCallback((loading: boolean) => {
        setIsLoading(loading);
    }, []);

    const handleErrorChange = useCallback((newError: string | null) => {
        setError(newError);
    }, []);

    return {
        isLoading,
        error,
        findLocationTrigger,
        findMyLocation,
        handleLoadingChange,
        handleErrorChange,
    };
}
