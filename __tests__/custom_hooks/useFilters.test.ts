import { act, renderHook } from '@testing-library/react';
import { useFilters, initialFilters } from '@/hooks/useFilters';
import { useSearchParams } from 'next/navigation';

jest.mock('next/navigation');

const newState = {
  onlyRemote: true,
  provider: [
    { value: 'Indeed', label: 'Indeed' },
    { value: 'LinkedIn', label: 'LinkedIn' },
  ],
  tags: [
    { value: 'reactjs', label: 'reactjs' },
    { value: 'typescript', label: 'typescript' },
  ],
};

describe('testing useFilters.', () => {
  beforeEach(() => {
    // Reset the useSearchParams mock before each test
    (useSearchParams as jest.Mock).mockReset();
  });

  test('returns activeFilters and newFilters with the default values without query args', () => {
    jest.unmock('next/navigation'); // No need the mock here

    const { result } = renderHook(() => useFilters());

    expect(result.current.activeFilters).toEqual(initialFilters);
    expect(result.current.newFilters).toEqual(initialFilters);
  });

  test('setState functions modify the underline state objects', () => {
    jest.unmock('next/navigation'); // No need the mock here

    const { result } = renderHook(() => useFilters());

    act(() => {
      result.current.setNewFilters(newState);
    });

    expect(result.current.newFilters).toEqual(newState);

    // But activeFilters still equal to default:
    expect(result.current.activeFilters).toEqual(initialFilters);

    act(() => {
      result.current.setActiveFilters(newState);
    });

    expect(result.current.activeFilters).toEqual(newState);
  });

  test('query params are parsed to set the filters', () => {
    const searchParams = new URLSearchParams();
    searchParams.set('onlyRemote', '1');
    searchParams.set('providersIn', 'Indeed,LinkedIn');
    searchParams.set('tagsIn', 'reactjs,typescript');

    (useSearchParams as jest.Mock).mockImplementation(() => searchParams);

    const { result } = renderHook(() => useFilters());

    expect(result.current.activeFilters).toEqual(newState);
    expect(result.current.newFilters).toEqual(newState);
  });
});
