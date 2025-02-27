'use client';

import React from 'react';
import { createContext, useState } from 'react';
import { useSearchParams } from 'next/navigation';

const MAX_AGE = 20;

interface AgeRangeContextValue {
  ageMin: number;
  ageMax: number;
  ageMinEnabled: boolean;
  ageMaxEnabled: boolean;
  handleAgeRangeChange: (ageMin: number, ageMax: number) => void;
  handleCheckboxChange: (type: 'min' | 'max') => void;
  MAX_AGE: number;
}

const AgeRangeContext = createContext<AgeRangeContextValue>({
  ageMin: 0,
  ageMax: MAX_AGE,
  ageMinEnabled: true,
  ageMaxEnabled: true,
  handleAgeRangeChange: () => { },
  handleCheckboxChange: () => { },
  MAX_AGE,
});

const AgeRangeProvider = ({ children }: { children: React.ReactNode }) => {
  const searchParams = useSearchParams();
  const ageMinParam = searchParams.get('ageMin');
  const ageMaxParam = searchParams.get('ageMax');

  const [ageMin, setAgeMin] = useState(ageMinParam ? parseInt(ageMinParam, 10) : 0);
  const [ageMax, setAgeMax] = useState(ageMaxParam ? parseInt(ageMaxParam, 10) : MAX_AGE);
  const [ageMinEnabled, setAgeMinEnabled] = useState(ageMin !== 0);
  const [ageMaxEnabled, setAgeMaxEnabled] = useState(ageMax !== MAX_AGE);

  const handleAgeRangeChange = (ageMin: number, ageMax: number) => {
    setAgeMin(ageMin);
    setAgeMax(ageMax);
  };

  const handleCheckboxChange = (type: 'min' | 'max') => {
    if (type === 'min') {
      setAgeMin(ageMinEnabled ? 0 : ageMin);
      setAgeMinEnabled(!ageMinEnabled);
    } else {
      setAgeMax(ageMaxEnabled ? MAX_AGE : ageMax);
      setAgeMaxEnabled(!ageMaxEnabled);
    }
  };

  return (
    <AgeRangeContext.Provider value={{
      ageMin,
      ageMax,
      ageMinEnabled,
      ageMaxEnabled,
      handleAgeRangeChange,
      handleCheckboxChange,
      MAX_AGE,
    }}>
      {children}
    </AgeRangeContext.Provider>
  );
};

export { AgeRangeProvider, AgeRangeContext };
