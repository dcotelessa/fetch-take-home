import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import SizeSelection from '@/app/ui/components/dogs/filters/SizeSelection';
import { SizeContext } from '@/app/context/SizeContext';

describe('SizeSelection component', () => {
  jest.mock('@/app/context/SizeContext', () => ({
    SizeContext: {
      Consumer: ({ children }: { children: (value: { size: number | null, setSize: (size: number) => void }) => React.ReactNode }) =>
        children({ size: null, setSize: jest.fn() }),
    },
  }));

  it('renders correctly with default size options', () => {
    const { getByText } = render(<SizeSelection />);
    expect(getByText('25')).toBeInTheDocument();
    expect(getByText('50')).toBeInTheDocument();
    expect(getByText('75')).toBeInTheDocument();
    expect(getByText('100')).toBeInTheDocument();
  });

  it('updates selected size when new size is selected', () => {
    const setSize = jest.fn();
    const contextValue = { size: 0, setSize, DEFAULT_SIZE: 25 };
    const { getByText } = render(
      <SizeContext.Provider value={contextValue}>
        <SizeSelection />
      </SizeContext.Provider>
    );
    const size50Button = getByText('50');
    fireEvent.click(size50Button);
    expect(setSize).toHaveBeenCalledTimes(1);
    expect(setSize).toHaveBeenCalledWith(50);
  });

  it('calls setSize when new size is selected', () => {
    const setSize = jest.fn();
    const contextValue = { size: 0, setSize, DEFAULT_SIZE: 25 };
    const { getByText } = render(
      <SizeContext.Provider value={contextValue}>
        <SizeSelection />
      </SizeContext.Provider>
    );
    const size100Button = getByText('100');
    fireEvent.click(size100Button);
    expect(setSize).toHaveBeenCalledTimes(1);
    expect(setSize).toHaveBeenCalledWith(100);
  });
});
