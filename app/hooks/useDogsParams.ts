import { useContext, useEffect } from 'react';
import { FiltersContext } from '@/app/context/FiltersContext';
import { LocationContext } from '@/app/context/LocationContext';

const useDogsParams = () => {
  const filtersContext = useContext(FiltersContext);
  const locationContext = useContext(LocationContext);
  
  const { params, loading, error, fetchDogs, searchResults, hasSearchResults } = filtersContext;
  const { zipCodes } = locationContext;

  useEffect(() => {
    fetchDogs();
  }, [params, zipCodes, fetchDogs]);

  return {
    params,
    loading,
    error,
    searchResults,
    hasSearchResults
  };
};

export default useDogsParams;
