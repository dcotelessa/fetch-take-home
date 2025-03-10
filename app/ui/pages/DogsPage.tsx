'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import useDogsParams from '@/app/hooks/useDogsParams';
import DogsList from '../components/dogs/DogsList';
import LoadingIcon from '../components/icons/LoadingIcon';
import Header from '../components/dogs/Header';
import Pagination from '../components/Pagination';

const DogsPage = () => {
  const router = useRouter();
  const [loaded, setLoaded] = useState(false);
  const { params, loading, error, hasSearchResults, fetchDogs } = useDogsParams();
  // Add a ref to track if we've already done the initial fetch
  const initialFetchDone = useRef(false);

  useEffect(() => {
    setLoaded(true);
    
    // Only do the initial fetch if it hasn't been done yet
    if (!initialFetchDone.current) {
      console.log("DogsPage: Performing initial fetch");
      fetchDogs();
      initialFetchDone.current = true;
    }
  }, [fetchDogs]);

  // most errors are unauthorized, so redirect to login
  useEffect(() => {
    if (error) {
      // Convert params to a Record<string, string> for URLSearchParams
      const paramsRecord: Record<string, string> = {
        breeds: params.breeds.join(','),
        zipCodes: params.zipCodes.join(','),
        ageMin: params.ageMin.toString(),
        ageMax: params.ageMax.toString(),
        size: params.size.toString(),
        from: params.from.toString(),
        sort: params.sort
      };
      
      router.push(`/login?${new URLSearchParams(paramsRecord).toString()}`);
    }
  }, [error, router, params]);

  if (error) {
    return (
      <div className="loading page-root">
        <div className={`container ${loaded ? 'loaded' : ''}`}>
          <p>Logging In...</p>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="loading page-root">
        <div className={`container ${loaded ? 'loaded' : ''}`}>
          <p>Loading...</p>
          <LoadingIcon />
        </div>
      </div>
    );
  }

  return (
    <div className="dogs page-root">
      <Header />
      {hasSearchResults ? (
        <>
          <DogsList />
          <Pagination />
        </>
      ) : (
        <div className="no-results">
          <p>No dogs found matching your criteria.</p>
          <p>Try adjusting your filters.</p>
        </div>
      )}
    </div>
  );
};

export default DogsPage;
