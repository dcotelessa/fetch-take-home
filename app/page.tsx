import { Suspense } from 'react';
import DogsPage from '@/app/ui/pages/DogsPage';
import { FavoritesProvider } from '@/app/context/FavoritesContext';
import { FiltersProvider } from '@/app/context/FiltersContext';
import { SelectedBreedsProvider } from '@/app/context/SelectedBreedsContext';
import { LocationProvider } from '@/app/context/LocationContext';

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <FavoritesProvider>
        <FiltersProvider>
          <SelectedBreedsProvider>
            <LocationProvider>
              <DogsPage />
            </LocationProvider>
          </SelectedBreedsProvider>
        </FiltersProvider>
      </FavoritesProvider>
    </Suspense>
  );
}
