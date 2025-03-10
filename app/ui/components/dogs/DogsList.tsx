import { useContext, useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import useDogs, { Dog } from '@/app/hooks/useDogs';
import { FavoritesContext } from '@/app/context/FavoritesContext';
import { FiltersContext } from '@/app/context/FiltersContext';
import LoadingIcon from '../icons/LoadingIcon';
import DogsCard from './DogsCard';
import BestMatchCard from './BestMatchCard';

const DogsList = () => {
    const router = useRouter();
    const { searchResults, loading: filtersLoading, error: filtersError } = useContext(FiltersContext);
    const { resultIds = [] } = searchResults || {};
    const [loaded, setLoaded] = useState<boolean>(false);
    const { starredDogsIds, toggleFavorite, totalStarredDogsIds } = useContext(FavoritesContext);
    // Use a ref to prevent redirect loops
    const hasRedirected = useRef(false);

    const { dogs, loading: dogsLoading, error: dogsError } = useDogs(resultIds);

    // Loaded state happens when the page mounts, not when the component mounts
    // allowing for css animations to activate
    useEffect(() => {
        setLoaded(true);
        // Reset the redirect flag when the component mounts
        hasRedirected.current = false;
        
        // Return cleanup function
        return () => {
            // Additional cleanup if needed
        };
    }, []);

    // most errors are unauthorized, so redirect to login
    useEffect(() => {
        // Only redirect if there's an error and we haven't already redirected
        if ((dogsError || filtersError) && !hasRedirected.current) {
            // Set the flag to prevent further redirects
            hasRedirected.current = true;
            router.push(`/login`);
        }
    }, [dogsError, filtersError, router]);

    // If we've redirected, show a loading state instead of attempting to render
    if ((dogsError || filtersError) && hasRedirected.current) {
        return (
            <div className="loading page-root">
                <div className={`container ${loaded ? 'loaded' : ''}`}>
                    <p>Logging Out...</p>
                </div>
            </div>
        )
    }

    if (dogsLoading || filtersLoading) {
        return (
            <div className="loading modal">
                <div className={`container ${loaded ? 'loaded' : ''}`}>
                    <p>Finding dogs</p>
                    <LoadingIcon />
                </div>
            </div>
        );
    }

    if (!dogs?.length && totalStarredDogsIds === 0) {
        return <div>No dogs found</div>;
    }

    return (
        <div className="grid">
            <BestMatchCard />
            {dogs?.map((dog: Dog) => (
                <DogsCard
                    key={dog.id}
                    dog={dog}
                    favorite={starredDogsIds.includes(dog.id)}
                    onToggleStar={toggleFavorite}
                />
            ))}
        </div>);
};

export default DogsList;
