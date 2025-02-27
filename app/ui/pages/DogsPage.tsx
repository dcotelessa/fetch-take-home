'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import LoadingIcon from '../components/icons/LoadingIcon';
import useDogsParams, { convertURLSearchParamsToDogParams } from '@/app/hooks/useDogsParams';
import DogsList from '../components/dogs/DogsList';
import Header from '../components/dogs/Header';
import Pagination from '../components/Pagination';

const DogsPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams.toString());

  const [loaded, setLoaded] = useState(false);

  const initialParams = convertURLSearchParamsToDogParams(params);
  const { searchResults, loading, error, totalPages, currentPage } = useDogsParams(initialParams);

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
      {searchResults && (
        <>
          <Header
            total={searchResults.total}
            totalPages={totalPages}
            currentPage={currentPage}
          />
          <DogsList
            dogIds={searchResults.resultIds}
          />
          <Pagination
            searchResults={searchResults}
            params={params}
            totalPages={totalPages}
            currentPage={currentPage}
          />
        </>
      )}
    </div>
  );
};

export default DogsPage;
