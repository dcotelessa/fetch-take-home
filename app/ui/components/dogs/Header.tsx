'use client';

import React, { useContext, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { FavoritesContext } from '@/app/context/FavoritesContext';
import { FiltersContext } from '@/app/context/FiltersContext';
import DogSearchFilters from './filters';
import LoadingIcon from '../icons/LoadingIcon';
import DogIcon from '../icons/DogIcon';
import './Header.css';

const Header = () => {
    const { params, searchResults, totalPages: contextTotalPages, currentPage: contextCurrentPage, loading: filtersLoading } = useContext(FiltersContext);
    const { total = 0 } = searchResults || {};
    const fetchUrl = process.env.NEXT_PUBLIC_FETCH_URL || ''
    const router = useRouter();
    const { totalStarredDogsIds } = useContext(FavoritesContext);
    const [loggingOut, setLoggingOut] = useState(false);
    
    // Calculate pagination values directly in the component
    // This ensures we have the most up-to-date values
    const calculatedValues = useMemo(() => {
        if (!searchResults) return { totalPages: null, currentPage: null };
        
        const size = params.size || 25; // Default size if not provided
        const from = params.from || 0;
        
        // Calculate totalPages directly from the search results
        const totalPages = searchResults.total ? Math.ceil(searchResults.total / size) : 0;
        
        // Calculate currentPage
        const currentPage = totalPages > 0 ? Math.floor(from / size) + 1 : 0;
        
        console.log('Header calculated pagination:', { 
            totalPages, 
            contextTotalPages, 
            currentPage, 
            contextCurrentPage,
            total: searchResults.total,
            size,
            from
        });
        
        return { totalPages, currentPage };
    }, [searchResults, params.size, params.from, contextTotalPages, contextCurrentPage]);
    
    const { totalPages, currentPage } = calculatedValues;

    const handleLogout = async () => {
        setLoggingOut(true);
        try {
            const response = await fetch(`${fetchUrl}/auth/logout`, {
                method: 'POST',
                credentials: 'include',
                mode: 'cors',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('LOGOUT ERROR: Logout failed');
            }

            // Create a URLSearchParams from params properly
            const searchParams = new URLSearchParams();
            
            if (params.breeds?.length > 0) {
                searchParams.set('breeds', params.breeds.join(','));
            }
            
            if (params.zipCodes?.length > 0) {
                searchParams.set('zipCodes', params.zipCodes.join(','));
            }
            
            searchParams.set('size', params.size.toString());
            searchParams.set('sort', params.sort);
            
            router.push(`/login?${searchParams.toString()}`);
        } catch (err) {
            console.error(err instanceof Error ? err.message : "ERROR: Unknown error on logout");
            setLoggingOut(false);
        }
    };

    return (
        <header className="header">
            <div className="header-logo">
                <DogIcon />
                <h1>Dog Match</h1>
            </div>
            <DogSearchFilters />
            <div className="header-actions">
                {filtersLoading && <span className="loading-indicator">Updating...</span>}
                {totalStarredDogsIds > 0 && (
                    <>
                        <span className="total-starred">
                            {totalStarredDogsIds} ★
                        </span>
                        {' | '}
                    </>
                )}
                {totalPages !== null && totalPages > 0 && currentPage !== null && (
                    <>
                        <span className="total-pages">{`Page ${currentPage} of ${totalPages}`}</span>
                        {' | '}
                    </>
                )}
                <span className="total-items">{total} total results</span>
                {loggingOut ? (
                    <LoadingIcon />
                ) : (
                    <button onClick={handleLogout}>Logout</button>
                )}
            </div>
        </header>
    );
};

export default Header;
