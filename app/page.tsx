import { Suspense } from 'react';
import DogsPage from '@/app/ui/pages/DogsPage';
import { FavoritesProvider } from '@/app/context/FavoritesContext';
import { FiltersProvider } from '@/app/context/FiltersContext';

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <FavoritesProvider>
        <FiltersProvider>
          <DogsPage />
        </FiltersProvider>
      </FavoritesProvider>
    </Suspense>
  );
}
