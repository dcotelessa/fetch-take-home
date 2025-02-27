'use client';

import React from 'react';
import { createContext, useEffect, useState } from 'react';

interface FavoritesContextValue {
  starredDogsIds: string[];
  toggleFavorite: (dogId: string) => void;
  totalStarredDogsIds: number;
}

const FavoritesContext = createContext<FavoritesContextValue>({
  starredDogsIds: [] as string[],
  toggleFavorite: () => {},
  totalStarredDogsIds: 0,
});

const FavoritesProvider = ({ children }: { children: React.ReactNode }) => {
  const [starredDogsIds, setStarredDogsIds] = useState(
    JSON.parse(localStorage.getItem('starredDogs') || '[]')
  );

  useEffect(() => {
    localStorage.setItem('starredDogs', JSON.stringify(starredDogsIds));
  }, [starredDogsIds]);

  const toggleFavorite = (dogId: string) => {
    if (starredDogsIds.includes(dogId)) {
      setStarredDogsIds(starredDogsIds.filter((id: string) => id !== dogId));
    } else {
      setStarredDogsIds([...starredDogsIds, dogId])
    }
  };

  const totalStarredDogsIds = starredDogsIds.length;

  return (
    <FavoritesContext.Provider value={{ starredDogsIds, toggleFavorite, totalStarredDogsIds }}>
      {children}
    </FavoritesContext.Provider>
  );
};

export { FavoritesProvider, FavoritesContext };
