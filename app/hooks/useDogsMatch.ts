'use client'

import { useState, useEffect } from 'react';
import { useContext } from 'react';
import { FavoritesContext } from '@/app/context/FavoritesContext';
import { Dog } from '@/app/hooks/useDogs';

interface Match {
    match: string;
}

const useDogsMatch = () => {
    const fetchUrl = process.env.NEXT_PUBLIC_FETCH_URL || ''
    const [match, setMatch] = useState<Match | null>(null);
    const [matchedDogs, setMatchedDogs] = useState<Dog[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { starredDogsIds, totalStarredDogsIds } = useContext(FavoritesContext);

    useEffect(() => {
        // Flag to prevent state updates after component unmount
        let isMounted = true;
        
        const fetchMatch = async () => {
            if (totalStarredDogsIds > 0) {
                setLoading(true);
                setError(null);
                try {
                    const response = await fetch(`${fetchUrl}/dogs/match`, {
                        method: 'POST',
                        credentials: 'include',
                        mode: 'cors',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(starredDogsIds),
                    });

                    // Safety check for unmounted component
                    if (!isMounted) return;

                    if (response.ok) {
                        const searchData = await response.json();
                        setMatch(searchData);
                    } else {
                        throw new Error(`response status: ${response.status}`);
                    }
                } catch (err) {
                    // Safety check for unmounted component
                    if (!isMounted) return;
                    
                    // Properly type the error
                    const errorMessage = err instanceof Error ? err.message : 'Unknown error';
                    setError(`MATCH ERROR: ${errorMessage}`);
                } finally {
                    // Safety check for unmounted component
                    if (isMounted) {
                        setLoading(false);
                    }
                }
            } else {
                if (isMounted) {
                    setMatch(null);
                }
            }
        };
        
        fetchMatch();
        
        // Cleanup function
        return () => {
            isMounted = false;
        };
    }, [starredDogsIds, totalStarredDogsIds, fetchUrl]);

    useEffect(() => {
        // Flag to prevent state updates after component unmount
        let isMounted = true;
        
        if (match) {
            const fetchDogs = async () => {
                setLoading(true);
                try {
                    const response = await fetch(`${fetchUrl}/dogs`, {
                        method: 'POST',
                        credentials: 'include',
                        mode: 'cors',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify([match.match]),
                    });

                    // Safety check for unmounted component
                    if (!isMounted) return;

                    if (response.ok) {
                        const searchData = await response.json();
                        setMatchedDogs(searchData);
                    } else {
                        throw new Error(`response status: ${response.status}`);
                    }
                } catch (err) {
                    // Safety check for unmounted component
                    if (!isMounted) return;
                    
                    // Properly type the error
                    const errorMessage = err instanceof Error ? err.message : 'Unknown error';
                    setError(`MATCH ERROR: ${errorMessage}`);
                } finally {
                    // Safety check for unmounted component
                    if (isMounted) {
                        setLoading(false);
                    }
                }
            }
            fetchDogs();
        } else {
            if (isMounted) {
                setMatchedDogs([]);
            }
        }
        
        // Cleanup function
        return () => {
            isMounted = false;
        };
    }, [match, fetchUrl]);

    return { match, matchedDogs, loading, error };
};

export default useDogsMatch;
