import React, { useContext, useEffect } from 'react';
import { FiltersContext } from '@/app/context/FiltersContext';
import { SelectedBreedsContext } from '@/app/context/SelectedBreedsContext';
import { LocationContext } from '@/app/context/LocationContext';
import FiltersComponent from './FiltersComponent';

// This component serves as a bridge between the Filters UI and the contexts
const DogSearchFilters: React.FC = () => {
  const filtersContext = useContext(FiltersContext);
  const selectedBreedsContext = useContext(SelectedBreedsContext);
  const locationContext = useContext(LocationContext);

  // On mount, sync up the contexts if needed
  useEffect(() => {
    // If there are breeds in URL params but not in SelectedBreedsContext, sync them
    if (filtersContext.params.breeds.length > 0 && 
        selectedBreedsContext.selectedBreeds.length === 0) {
      console.log("Syncing breeds from URL to SelectedBreedsContext:", 
                 filtersContext.params.breeds);
                 
      // We can't directly set them, but we can simulate the selection
      filtersContext.params.breeds.forEach(breed => {
        selectedBreedsContext.handleBreedChange(breed);
      });
    }
    
    // If there are zipCodes in URL params but not in LocationContext, sync them
    if (filtersContext.params.zipCodes.length > 0 && 
        locationContext.zipCodes.length === 0) {
      console.log("Syncing zipCodes from URL to LocationContext:", 
                 filtersContext.params.zipCodes);
                 
      // We can't directly set them, but we can simulate the selection
      filtersContext.params.zipCodes.forEach(zipCode => {
        locationContext.handleZipCodeChange(zipCode);
      });
    }
  }, [filtersContext.params, selectedBreedsContext, locationContext]);

  // Load dogs when filters change
  useEffect(() => {
    // Fetch dogs only after component is mounted and contexts are synced
    const timer = setTimeout(() => {
      filtersContext.fetchDogs();
    }, 100);
    
    return () => clearTimeout(timer);
  }, [filtersContext.fetchDogs]);

  // Simply render the Filters component
  return <FiltersComponent />;
};

export default DogSearchFilters;
