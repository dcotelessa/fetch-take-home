'use client';

import { useEffect, useState } from 'react';
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

  useEffect(() => {
    setLoaded(true);
    // Initial fetch of dogs
    fetchDogs();
  }, [fetchDogs]);

  // most errors are unauthorized, so redirect to login
  useEffect(() => {
    if (error) {
      router.push(`/login?${new URLSearchParams(params).toString()}`);
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
