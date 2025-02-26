'use client';

import React from 'react';
import { createContext, useState } from 'react';
import { useSearchParams } from 'next/navigation';

const DEFAULT_SORT = "breed:asc";

interface SortDogsContext {
  sort: string,
  setSort: (sort: string) => void,
  DEFAULT_SORT: string
}

const SortDogsContext = createContext<SortDogsContext>({
  sort: DEFAULT_SORT,
  setSort: (_sort: string) => { },
  DEFAULT_SORT,
});

const SortDogsProvider = ({ children }: { children: React.ReactNode }) => {
  const searchParams = useSearchParams();
  const sortParam = searchParams.get('sort');

  const [sort, setSort] = useState<string>(sortParam || DEFAULT_SORT);

  return (
    <SortDogsContext.Provider value={{
      sort,
      setSort,
      DEFAULT_SORT,
    }}>
      {children}
    </SortDogsContext.Provider>
  );
};

export { SortDogsProvider, SortDogsContext };

