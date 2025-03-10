import { useState, useEffect } from 'react';

interface Location {
    zip_code: string
    latitude: number
    longitude: number
    city: string
    state: string
    county: string
}

export interface Coordinates {
    lat: number;
    lon: number;
}

const useLocation = () => {
    const fetchUrl = process.env.NEXT_PUBLIC_FETCH_URL || ''
    const [locations, setLocations] = useState<Location[] | null>(null);
    const [zipCodes, setZipCodes] = useState<string[] | null>(null); // Changed from number[] to string[]
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<null | string>(null);

    useEffect(() => {
        // Only run the effect if zipCodes is not null
        if (zipCodes === null) return;
        
        const fetchLocations = async () => {
            setLoading(true);
            try {
                const response = await fetch(`${fetchUrl}/locations`, {
                    method: 'POST',
                    credentials: 'include',
                    mode: 'cors',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(zipCodes),
                });

                if (response.ok) {
                    const searchData = await response.json();
                    setLocations(searchData);
                } else {
                    throw new Error(`response status: ${response.status}`);
                }
            } catch (err) {
                // Properly type the error
                const errorMessage = err instanceof Error ? err.message : 'Unknown error';
                setError(`LOCATION ERROR: ${errorMessage}`);
            } finally {
                setLoading(false);
            }
        };
        
        fetchLocations();
    }, [zipCodes, fetchUrl]);

    return { locations, loading, error, setZipCodes };
};

export default useLocation;
