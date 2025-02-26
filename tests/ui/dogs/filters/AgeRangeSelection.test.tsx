import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import AgeRangeSelection from '@/app/ui/components/dogs/filters/AgeRangeSelection';
import { AgeRangeContext } from '@/app/context/AgeRangeContext';

describe('AgeRangeSelection component', () => {
  it('renders correctly with default age range options', () => {
    const { getByText } = render(<AgeRangeSelection />);
    expect(getByText('Min Age')).toBeInTheDocument();
    expect(getByText('Max Age')).toBeInTheDocument();
  });

  it('updates selected age range when new age is selected', () => {
    const setAgeRange = jest.fn();
    const contextValue = { ageRange: { min: 0, max: 20 }, setAgeRange, DEFAULT_AGE_RANGE: { min: 0, max: 20 } };
    const { getByText } = render(
      <AgeRangeContext.Provider value={contextValue}>
        <AgeRangeSelection />
      </AgeRangeContext.Provider>
    );
    const minAgeInput = getByText('Min Age');
    fireEvent.change(minAgeInput, { target: { value: '5' } });
    expect(setAgeRange).toHaveBeenCalledTimes(1);
    expect(setAgeRange).toHaveBeenCalledWith({ min: 5, max: 20 });
  });

  it('calls setAgeRange when new age is selected', () => {
    const setAgeRange = jest.fn();
    const contextValue = { ageRange: { min: 0, max: 20 }, setAgeRange, DEFAULT_AGE_RANGE: { min: 0, max: 20 } };
    const { getByText } = render(
      <AgeRangeContext.Provider value={contextValue}>
        <AgeRangeSelection />
      </AgeRangeContext.Provider>
    );
    const maxAgeInput = getByText('Max Age');
    fireEvent.change(maxAgeInput, { target: { value: '15' } });
    expect(setAgeRange).toHaveBeenCalledTimes(1);
    expect(setAgeRange).toHaveBeenCalledWith({ min: 0, max: 15 });
  });
});
