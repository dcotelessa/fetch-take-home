'use client';

import React from 'react';
import { createContext, useContext, useEffect, useState } from 'react';
import { FiltersContext } from './FiltersContext';

interface SelectedBreedsContextValue {
  selectedBreeds: string[];
  handleBreedChange: (breed: string) => void;
}

const SelectedBreedsContext = createContext<SelectedBreedsContextValue>({
  selectedBreeds: [] as string[],
  handleBreedChange: () => {},
});

const SelectedBreedsProvider = ({ children }: { children: React.ReactNode }) => {
  const { params } = useContext(FiltersContext);
  const { breeds } = params;

  const [selectedBreeds, setSelectedBreeds] = useState<string[]>(breeds);

  useEffect(() => {
    setSelectedBreeds(breeds);
  }, [breeds]);

  const handleBreedChange = (breed: string) => {
          const newBreeds = [...selectedBreeds];
          if (newBreeds.includes(breed)) {
                  newBreeds.splice(newBreeds.indexOf(breed), 1);
          } else {
                  newBreeds.push(breed);
          }
          setSelectedBreeds(newBreeds);
  };


  return (
    <SelectedBreedsContext.Provider value={{ selectedBreeds, handleBreedChange }}>
      {children}
    </SelectedBreedsContext.Provider>
  );
};

export { SelectedBreedsProvider, SelectedBreedsContext };

