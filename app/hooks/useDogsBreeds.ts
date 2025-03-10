import { useState, useEffect, useMemo } from 'react';

interface DogBreedsProps {
    breeds: string[];
    error: string | null;
}

export const useDogsBreeds = (): DogBreedsProps => {
    const fetchUrl = process.env.NEXT_PUBLIC_FETCH_URL || ''
    const [breeds, setBreeds] = useState<string[]>([]);
    const [error, setError] = useState<string | null>(null);

    const memoizedBreeds = useMemo(() => breeds, [breeds]);

    // Fetch breeds on mount with proper cleanup
    useEffect(() => {
        let isMounted = true; // Flag to track component mount state
        
        const fetchBreeds = async () => {
            try {
                const response = await fetch(`${fetchUrl}/dogs/breeds`, {
                    method: 'GET',
                    credentials: 'include',
                    mode: 'cors',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                
                // Only update state if component is still mounted
                if (!isMounted) return;
                
                if (response.ok) {
                    const breedsData = await response.json();
                    setBreeds(breedsData);
                } else {
                    throw new Error(`response status: ${response.status}`);
                }
            } catch (err) {
                // Only update state if component is still mounted
                if (!isMounted) return;
                
                const errorMessage = err instanceof Error ? err.message : 'Unknown error';
                setError(`BREEDS ERROR: ${errorMessage}`);
            }
        };
        
        fetchBreeds();
        
        // Cleanup function to prevent state updates after unmount
        return () => {
            isMounted = false;
        };
    }, [fetchUrl]);

    return { breeds: memoizedBreeds, error };
}

export default useDogsBreeds;
