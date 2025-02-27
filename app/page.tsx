import { Suspense } from 'react';
import DogsPage from '@/app/ui/pages/DogsPage';
import { FavoritesProvider } from '@/app/context/FavoritesContext';
import { SelectedBreedsProvider } from '@/app/context/SelectedBreedsContext';
import { AgeRangeProvider } from '@/app/context/AgeRangeContext';
import { SizeProvider } from '@/app/context/SizeContext';
import { SortDogsProvider } from '@/app/context/SortDogsContext';

export default function Page() {
  return (
    <FavoritesProvider>
      <SelectedBreedsProvider>
        <AgeRangeProvider>
          <SizeProvider>
            <SortDogsProvider>
              <Suspense fallback={<div>Loading...</div>}>
                <DogsPage />
              </Suspense>
            </SortDogsProvider>
          </SizeProvider>
        </AgeRangeProvider>
      </SelectedBreedsProvider>
    </FavoritesProvider>
  );
}
