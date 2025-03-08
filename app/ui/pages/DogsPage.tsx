'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import LoadingIcon from '../components/icons/LoadingIcon';
import useDogsParams from '@/app/hooks/useDogsParams';
import DogsList from '../components/dogs/DogsList';
import Header from '../components/dogs/Header';
import Pagination from '../components/Pagination';

const DogsPage = () => {
  const router = useRouter();
  const [loaded, setLoaded] = useState(false);

  const { params, hasSearchResults, loading, error } = useDogsParams();

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
