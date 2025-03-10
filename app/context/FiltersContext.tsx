'use client';

import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { SelectedBreedsContext } from './SelectedBreedsContext';

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
  updateSearchParams: () => void;
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
  const router = useRouter();
  const searchParams = useSearchParams();
  const { selectedBreeds } = useContext(SelectedBreedsContext);

  searchParams.forEach((value, key) => {
    if (key === 'breeds') {
      initParams[key] = value.split(',');
    }

    if (key === 'zipCodes') {
      initParams[key] = value.split(',');
    }

    if (key === 'ageMin' || key === 'ageMax' || key === 'from' || key === 'size') {
      initParams[key] = parseInt(value, 10);
    }

    if (key === 'sort') {
      initParams[key] = value;
    } else {
      initParams['sort'] = DEFAULT_SORT;
    }
  });
  initParams['ageMinEnabled'] = initParams.ageMin !== 0;
  initParams['ageMaxEnabled'] = initParams.ageMax !== MAX_AGE;

  const fetchUrl = process.env.NEXT_PUBLIC_FETCH_URL || '';
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [params, setParams] = useState<DogParams>(initParams);
  const [searchResults, setSearchResults] = useState<DogSearchParams | null>(null);

  // Calculate derived state
  const size = params.size || DEFAULT_SIZE;
  const totalPages = useMemo(() => {
    if (!searchResults) return null;
    return Math.ceil(searchResults.total / size);
  }, [searchResults, size]);

  const from = params.from || 0;
  const currentPage = useMemo(() => {
    if (!searchResults) return null;
    return Math.floor(from / size) + 1;
  }, [from, size, searchResults]);

  const hasSearchResults = useMemo(() => {
    if (!searchResults) return false;
    return searchResults.resultIds.length > 0 || false;
  }, [searchResults]);
  const validateParams = (newParams: DogUpdateParams) => {
    // TODO: Needs more validation
    if (newParams.ageMin && newParams.ageMin > MAX_AGE) {
      return false;
    }

    if (newParams.ageMax && newParams.ageMax > MAX_AGE) {
      return false;
    }

    return true;
  }

  const handleParamsChange = (newParams: DogUpdateParams) => {
    if (validateParams(newParams)) {
      return;
    }
    setParams({ ...params, ...newParams });
  }

  const handleAgeCheckboxChange = (type: 'min' | 'max') => {
    if (type === 'min') {
      setParams((prevParams) => ({ ...prevParams, ageMax: prevParams.ageMinEnabled ? 0 : prevParams.ageMin, ageMinEnabled: !prevParams.ageMinEnabled }));
    } else {
      setParams((prevParams) => ({ ...prevParams, ageMax: prevParams.ageMaxEnabled ? MAX_AGE : prevParams.ageMax, ageMaxEnabled: !prevParams.ageMaxEnabled }));
    }
  };

  const updateSearchParams = (): void => {
    const newParams = new URLSearchParams();

    if (selectedBreeds.length) {
      newParams.append('breeds', selectedBreeds.join(','));
    }

    Object.entries(params).forEach(([key, value]) => {
      if (key === 'zipCodes') {
        newParams.append(key, value.join(','));
      } else if (key === 'ageMin' || key === 'ageMax' || key === 'size') {
        newParams.append(key, value.toString());
      } else if (key === 'from' || key === 'sort') {
        newParams.append(key, value);
      }
    });

    router.push(`/?${newParams.toString()}`);
  }

  const fetchDogs = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${fetchUrl}/dogs/search?${searchParams.toString()}`, {
        method: 'GET',
        credentials: 'include',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        setError(`response status: ${response.status}`);
      }

      const data = await response.json();
      setSearchResults(data);
    } catch (err: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
      setError(`DOGS PARAMS ERROR: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }, [fetchUrl, searchParams]);


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
