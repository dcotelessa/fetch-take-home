'use client';

import React from 'react';
import { createContext, useState } from 'react';
import { useSearchParams } from 'next/navigation';

const DEFAULT_SIZE: number = 25;

interface SizeContextValue {
  size: number;
  setSize: (size: number) => void;
  DEFAULT_SIZE: number;
}

const SizeContext = createContext<SizeContextValue>({
  size: DEFAULT_SIZE,
  setSize: () => {},
  DEFAULT_SIZE,
});

const SizeProvider = ({ children }: { children: React.ReactNode }) => {
  const searchParams = useSearchParams();
  const sizeParam = searchParams.get('size');

  const [size, setSize] = useState<number>(sizeParam && (parseInt(sizeParam, 10)) || DEFAULT_SIZE);

  return (
    <SizeContext.Provider value={{
      size,
      setSize,
      DEFAULT_SIZE,
    }}>
      {children}
    </SizeContext.Provider>
  );
};

export { SizeProvider, SizeContext };


