'use client';

import React from 'react';
import { createContext, useState } from 'react';
import { useSearchParams } from 'next/navigation';

interface SelectedBreedsContextValue {
  selectedBreeds: string[];
  handleBreedChange: (breed: string) => void;
}

const SelectedBreedsContext = createContext<SelectedBreedsContextValue>({
  selectedBreeds: [] as string[],
  handleBreedChange: (_breed: string) => {},
});

const SelectedBreedsProvider = ({ children }: { children: React.ReactNode }) => {
  const searchParams = useSearchParams();
  const breedsParam = searchParams.getAll('breeds');

  const [selectedBreeds, setSelectedBreeds] = useState<string[]>(breedsParam || []);

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

