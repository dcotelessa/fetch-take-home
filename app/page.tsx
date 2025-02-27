'use client'

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
              <DogsPage />
            </SortDogsProvider>
          </SizeProvider>
        </AgeRangeProvider>
      </SelectedBreedsProvider>
    </FavoritesProvider>
  );
}
