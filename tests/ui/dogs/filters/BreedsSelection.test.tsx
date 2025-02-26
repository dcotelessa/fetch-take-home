import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import BreedsSelection from '@/app/ui/components/dogs/filters/BreedsSelection';
import { SelectedBreedsContext } from '@/app/context/SelectedBreedsContext';

describe('BreedsSelection component', () => {
  jest.mock('@/app/context/SelectedBreedsContext', () => ({
    SelectedBreedsContext: {
      Consumer: ({ children }: { children: (value: { selectedBreeds: string[] | null, setSelectedBreeds: (breeds: string[]) => void }) => React.ReactNode }) =>
        children({ selectedBreeds: null, setSelectedBreeds: jest.fn() }),
    },
  }));

  it('renders correctly with default breed options', () => {
    const contextValue = { selectedBreeds: [], handleBreedChange: () => { } };
    const { getByText } = render(
      <SelectedBreedsContext.Provider value={contextValue}>
        <BreedsSelection  />
      </SelectedBreedsContext.Provider>
    );
    expect(getByText('Select Breeds')).toBeInTheDocument();
  });

  it('updates selected breeds when new breed is selected', () => {
    const setSelectedBreeds = jest.fn();
    const contextValue = { selectedBreeds: [], handleBreedChange: setSelectedBreeds };
    const { getByText } = render(
      <SelectedBreedsContext.Provider value={contextValue}>
        <BreedsSelection />
      </SelectedBreedsContext.Provider>
    );
    const labradorCheckbox = getByText('Labrador');
    fireEvent.click(labradorCheckbox);
    expect(setSelectedBreeds).toHaveBeenCalledTimes(1);
    expect(setSelectedBreeds).toHaveBeenCalledWith(['Labrador']);
  });

  it('calls setSelectedBreeds when breed is deselected', () => {
    const setSelectedBreeds = jest.fn();
    const contextValue = { selectedBreeds: [], handleBreedChange: setSelectedBreeds };
    const { getByText } = render(
      <SelectedBreedsContext.Provider value={contextValue}>
        <BreedsSelection />
      </SelectedBreedsContext.Provider>
    );
    const labradorCheckbox = getByText('Labrador');
    fireEvent.click(labradorCheckbox);
    expect(setSelectedBreeds).toHaveBeenCalledTimes(1);
    expect(setSelectedBreeds).toHaveBeenCalledWith([]);
  });

  it('renders filtered breeds when filter text is entered', () => {
    const setSelectedBreeds = jest.fn();
    const contextValue = { selectedBreeds: [], handleBreedChange: setSelectedBreeds };
    const { getByText } = render(
      <SelectedBreedsContext.Provider value={contextValue}>
        <BreedsSelection />
      </SelectedBreedsContext.Provider>
    );
    const filterInput = getByText('Filter breeds');
    fireEvent.change(filterInput, { target: { value: 'Lab' } });
    expect(getByText('Labrador')).toBeInTheDocument();
    expect(getByText('German Shepherd')).not.toBeInTheDocument();
    expect(getByText('Golden Retriever')).not.toBeInTheDocument();
  });
});
