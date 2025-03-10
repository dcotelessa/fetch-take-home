'use client';

import React from 'react';
import { createContext, useContext, useEffect, useState } from 'react';
import { FiltersContext } from './FiltersContext';

interface SelectedBreedsContextValue {
  selectedBreeds: string[];
  handleBreedChange: (breed: string) => void;
  applyBreedChanges: () => void;
}

const SelectedBreedsContext = createContext<SelectedBreedsContextValue>({
  selectedBreeds: [] as string[],
  handleBreedChange: () => {},
  applyBreedChanges: () => {},
});

const SelectedBreedsProvider = ({ children }: { children: React.ReactNode }) => {
  const { params, updateSearchParams } = useContext(FiltersContext);
  const { breeds } = params;

  const [selectedBreeds, setSelectedBreeds] = useState<string[]>(breeds);

  // Update selected breeds when the FiltersContext breeds change
  useEffect(() => {
    setSelectedBreeds(breeds);
  }, [breeds]);

  const handleBreedChange = (breed: string) => {
    console.log("Changing breed selection:", breed); // Debugging
    setSelectedBreeds(prev => {
      const newBreeds = [...prev];
      if (newBreeds.includes(breed)) {
        console.log("Removing breed:", breed); // Debugging
        return newBreeds.filter(item => item !== breed);
      } else {
        console.log("Adding breed:", breed); // Debugging
        return [...newBreeds, breed];
      }
    });
  };

  // Add a new function to apply the breed changes to search params
  const applyBreedChanges = () => {
    console.log("Applying breed changes:", selectedBreeds); // Debugging
    updateSearchParams(selectedBreeds);
  };

  return (
    <SelectedBreedsContext.Provider value={{ 
      selectedBreeds, 
      handleBreedChange, 
      applyBreedChanges 
    }}>
      {children}
    </SelectedBreedsContext.Provider>
  );
};

export { SelectedBreedsProvider, SelectedBreedsContext };
