'use client';

import { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { FiltersContext } from '@/app/context/FiltersContext';
import DogsList from '../components/dogs/DogsList';
import LoadingIcon from '../components/icons/LoadingIcon';
import Header from '../components/dogs/Header';
import Pagination from '../components/Pagination';

const DogsPage = () => {
  const router = useRouter();
  const filtersContext = useContext(FiltersContext);
  const [loaded, setLoaded] = useState(false);

  const { params, loading, error, hasSearchResults } = filtersContext;

  useEffect(() => {
    setLoaded(true);
  }, []);

  // most errors are unauthorized, so redirect to login
  useEffect(() => {
    if (error) {
      router.push(`/login?${params.toString()}`);
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
      {hasSearchResults && (
        <>
          <Header />
          <DogsList />
          <Pagination />
        </>
      )}
    </div>
  );
};

export default DogsPage;
