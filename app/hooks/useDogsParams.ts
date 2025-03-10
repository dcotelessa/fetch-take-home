import { useContext, useCallback } from 'react';
import { FiltersContext } from '@/app/context/FiltersContext';
import { LocationContext } from '@/app/context/LocationContext';
import { SelectedBreedsContext } from '@/app/context/SelectedBreedsContext';

const useDogsParams = () => {
  const filtersContext = useContext(FiltersContext);
  const locationContext = useContext(LocationContext);
  const selectedBreedsContext = useContext(SelectedBreedsContext);
  
  const { params, loading, error, fetchDogs: baseFetchDogs, searchResults, hasSearchResults } = filtersContext;
  const { zipCodes } = locationContext;
  const { selectedBreeds } = selectedBreedsContext;

  // Enhanced fetchDogs that considers both contexts
  const fetchDogs = useCallback(() => {
    // Just call the base fetchDogs from FiltersContext
    // The FiltersContext already has access to the updated params
    baseFetchDogs();
  }, [baseFetchDogs]);

  return {
    params,
    loading,
    error,
    searchResults,
    hasSearchResults,
    fetchDogs,
    selectedBreeds,
    zipCodes
  };
};

export default useDogsParams;
