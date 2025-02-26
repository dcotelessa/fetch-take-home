import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import SortDogsSelection from '@/app/ui/components/dogs/filters/SortDogsSelection';
import { SortDogsContext } from '@/app/context/SortDogsContext';

describe('SortDogsSelection component', () => {
  it('renders correctly with default sort options', () => {
    const { getByText } = render(<SortDogsSelection />);
    expect(getByText('Breed')).toBeInTheDocument();
    expect(getByText('Name')).toBeInTheDocument();
    expect(getByText('Age')).toBeInTheDocument();
  });

  it('updates selected sort option when new option is selected', () => {
    const setSort = jest.fn();
    const contextValue = { sort: 'breed', setSort, DEFAULT_SORT: 'breed' };
    const { getByText } = render(
      <SortDogsContext.Provider value={contextValue}>
        <SortDogsSelection />
      </SortDogsContext.Provider>
    );
    const nameButton = getByText('Name');
    fireEvent.click(nameButton);
    expect(setSort).toHaveBeenCalledTimes(1);
    expect(setSort).toHaveBeenCalledWith('name');
  });

  it('calls setSort when new sort option is selected', () => {
    const setSort = jest.fn();
    const contextValue = { sort: 'breed', setSort, DEFAULT_SORT: 'breed' };
    const { getByText } = render(
      <SortDogsContext.Provider value={contextValue}>
        <SortDogsSelection />
      </SortDogsContext.Provider>
    );
    const ageButton = getByText('Age');
    fireEvent.click(ageButton);
    expect(setSort).toHaveBeenCalledTimes(1);
    expect(setSort).toHaveBeenCalledWith('age');
  });
});
