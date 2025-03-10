'use client';

import React, { createContext, useCallback, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

const MAX_AGE: number = 20;
const DEFAULT_SORT: string = "breed:asc";
const DEFAULT_SIZE: number = 25;

interface DogUpdateParams {
  breeds?: string[];
  zipCodes?: string[];
  ageMin?: number;
  ageMinEnabled?: boolean;
  ageMax?: number;
  ageMaxEnabled?: boolean;
  size?: number;
  from?: number;
  sort?: string;
}

interface DogParams {
  breeds: string[];
  zipCodes: string[];
  ageMin: number;
  ageMinEnabled: boolean;
  ageMax: number;
  ageMaxEnabled: boolean;
  size: number;
  from: number;
  sort: string;
}

interface DogSearchParams {
  resultIds: string[];
  total: number; // total number of results, not just the current page
  next: string | null; // a query to request the next page of results (if one exists)
  prev: string | null; // a query to request the previous page of results (if one exists)
}

interface FiltersContextValue {
  handleParamsChange: (params: DogUpdateParams) => void;
  handleAgeCheckboxChange: (type: 'min' | 'max') => void;
  loading: boolean;
  error: string | null;
  params: DogParams;
  fetchDogs: () => void;
  searchResults: DogSearchParams | null;
  updateSearchParams: (selectedBreeds?: string[]) => void;
  MAX_AGE: number;
  DEFAULT_SIZE: number,
  DEFAULT_SORT: string,
  totalPages: number | null;
  currentPage: number | null;
  size: number;
  hasSearchResults: boolean;
}

const initParams: DogParams = {
  breeds: [],
  zipCodes: [],
  ageMin: 0,
  ageMinEnabled: true,
  ageMax: MAX_AGE,
  ageMaxEnabled: true,
  size: DEFAULT_SIZE,
  from: 0,
  sort: DEFAULT_SORT
};

const FiltersContext = createContext<FiltersContextValue>({
  handleParamsChange: () => { },
  handleAgeCheckboxChange: () => { },
  loading: false,
  error: null,
  params: initParams,
  fetchDogs: () => { },
  searchResults: null,
  updateSearchParams: () => { },
  MAX_AGE,
  DEFAULT_SIZE,
  DEFAULT_SORT,
  totalPages: null,
  currentPage: null,
  size: DEFAULT_SIZE,
  hasSearchResults: false
});

const FiltersProvider = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter()
  const searchParams = useSearchParams();

  // Create a mutable copy of initParams with values from URL
  const initialParams = { ...initParams };

  searchParams.forEach((value, key) => {
    if (key === 'breeds') {
      initialParams.breeds = value.split(',');
    }

    if (key === 'zipCodes') {
      initialParams.zipCodes = value.split(',');
    }

    if (key === 'ageMin' || key === 'ageMax' || key === 'from' || key === 'size') {
      initialParams[key] = parseInt(value, 10);
    }

    if (key === 'sort') {
      initialParams.sort = value;
    }
  });

  initialParams.ageMinEnabled = initialParams.ageMin !== 0;
  initialParams.ageMaxEnabled = initialParams.ageMax !== MAX_AGE;

  const fetchUrl = process.env.NEXT_PUBLIC_FETCH_URL || '';
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [params, setParams] = useState<DogParams>(initialParams);
  const [searchResults, setSearchResults] = useState<DogSearchParams | null>(null);

// Calculate derived state
const size = params.size || DEFAULT_SIZE;

// Fix: Ensure totalPages calculation is consistent and handles all edge cases
const totalPages = useMemo(() => {
  // No search results yet, return null to indicate pagination isn't ready
  if (!searchResults) return null;
  
  // If total is 0, return 0 pages
  if (!searchResults.total) return 0;
  
  // Calculate total pages and ensure it's at least 1 if there are results
  const calculated = Math.ceil(searchResults.total / size);
  return calculated;
}, [searchResults, size]);

const from = params.from || 0;

const currentPage = useMemo(() => {
  // No search results yet, return null to indicate pagination isn't ready
  if (!searchResults) return null;
  
  // If there are no results or pages, return 0
  if (!searchResults.total || totalPages === 0) return 0;
  
  // Calculate current page, starting from 1
  const calculated = Math.floor(from / size) + 1;
  return calculated;
}, [from, size, searchResults, totalPages]);

const hasSearchResults = useMemo(() => {
  if (!searchResults) return false;
  return Boolean(searchResults.resultIds?.length);
}, [searchResults]);
  const validateParams = (newParams: DogUpdateParams) => {
    // Return true if params are valid
    if (newParams.ageMin && newParams.ageMin > MAX_AGE) {
      return false;
    }

    if (newParams.ageMax && newParams.ageMax > MAX_AGE) {
      return false;
    }

    return true;
  }

  const handleParamsChange = (newParams: DogUpdateParams) => {
    if (!validateParams(newParams)) {
      return;
    }
    setParams({ ...params, ...newParams });
  }

  const handleAgeCheckboxChange = (type: 'min' | 'max') => {
    if (type === 'min') {
      setParams((prevParams) => ({
        ...prevParams,
        ageMin: prevParams.ageMinEnabled ? 0 : prevParams.ageMin,
        ageMinEnabled: !prevParams.ageMinEnabled
      }));
    } else {
      setParams((prevParams) => ({
        ...prevParams,
        ageMax: prevParams.ageMaxEnabled ? MAX_AGE : prevParams.ageMax,
        ageMaxEnabled: !prevParams.ageMaxEnabled
      }));
    }
  };

  const buildSearchQueryString = useCallback((selectedBreeds?: string[], customZipCodes?: string[]) => {
    const queryParams = new URLSearchParams();

    // Add breeds if they exist, prioritizing the selectedBreeds parameter if provided
    if (selectedBreeds && selectedBreeds.length > 0) {
      queryParams.set('breeds', selectedBreeds.join(','));
    } else if (params.breeds && params.breeds.length > 0) {
      queryParams.set('breeds', params.breeds.join(','));
    }

    // Add zipCodes if they exist, prioritizing customZipCodes if provided
    if (customZipCodes && customZipCodes.length > 0) {
      queryParams.set('zipCodes', customZipCodes.join(','));
    } else if (params.zipCodes && params.zipCodes.length > 0) {
      queryParams.set('zipCodes', params.zipCodes.join(','));
    }

    // Add age constraints if enabled
    if (params.ageMinEnabled && params.ageMin > 0) {
      queryParams.set('ageMin', params.ageMin.toString());
    }

    if (params.ageMaxEnabled && params.ageMax < MAX_AGE) {
      queryParams.set('ageMax', params.ageMax.toString());
    }

    // Add sort and pagination
    queryParams.set('sort', params.sort);
    queryParams.set('size', params.size.toString());
    queryParams.set('from', params.from.toString());

    return queryParams;
  }, [params]);

  const updateSearchParams = useCallback((selectedBreeds?: string[], customZipCodes?: string[]): void => {
    const queryParams = buildSearchQueryString(selectedBreeds, customZipCodes);
    router.push(`/?${queryParams.toString()}`);
  }, [buildSearchQueryString, router]);

  const fetchDogs = useCallback(async () => {
    // Prevent fetching if already loading
    if (loading) {
      console.log("Skipping fetch: already loading");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Convert params to URL-compatible format
      const queryString = new URLSearchParams();

      if (params.breeds.length > 0) {
        queryString.set('breeds', params.breeds.join(','));
      }

      if (params.zipCodes.length > 0) {
        queryString.set('zipCodes', params.zipCodes.join(','));
      }

      if (params.ageMinEnabled && params.ageMin > 0) {
        queryString.set('ageMin', params.ageMin.toString());
      }

      if (params.ageMaxEnabled && params.ageMax < MAX_AGE) {
        queryString.set('ageMax', params.ageMax.toString());
      }

      queryString.set('sort', params.sort);
      queryString.set('size', params.size.toString());
      queryString.set('from', params.from.toString());

      console.log(`Fetching dogs with params: ${queryString.toString()}`);

      const response = await fetch(`${fetchUrl}/dogs/search?${queryString.toString()}`, {
        method: 'GET',
        credentials: 'include',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        setError(`response status: ${response.status}`);
        return;
      }

      const data = await response.json();
      setSearchResults(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(`DOGS PARAMS ERROR: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  }, [fetchUrl, params, loading, MAX_AGE]);

  return (
    <FiltersContext.Provider value={{
      handleParamsChange,
      handleAgeCheckboxChange,
      loading,
      error,
      params,
      searchResults,
      fetchDogs,
      updateSearchParams,
      MAX_AGE,
      DEFAULT_SIZE,
      DEFAULT_SORT,
      totalPages,
      currentPage,
      size,
      hasSearchResults
    }}>
      {children}
    </FiltersContext.Provider>
  );
};

export { FiltersProvider, FiltersContext };
