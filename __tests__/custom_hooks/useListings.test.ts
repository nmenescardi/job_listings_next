import useListings from '@/hooks/useListings';
import { renderHook } from '@testing-library/react';
import useSWR from 'swr';

jest.mock('swr');

const activeFilters = {
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
let perPage = 20;
let currentPage = 2;

describe('useListings', () => {
  beforeEach(() => {
    (useSWR as jest.Mock).mockReturnValue({
      data: null,
      isLoading: true,
      error: null,
    });
  });

  test('calls useSWR with correct parameters', () => {
    const { result } = renderHook(() =>
      useListings(activeFilters, perPage, currentPage)
    );

    console.log(result);

    expect(useSWR).toBeCalledTimes(1);

    const useSwrAny = useSWR as any; // don't judge me

    expect(useSwrAny.mock.calls[0][0]()).toContain('onlyRemote=1');
    expect(useSwrAny.mock.calls[0][0]()).toContain(
      'providersIn=[Indeed,LinkedIn]'
    );
    expect(useSwrAny.mock.calls[0][0]()).toContain(
      'tagsIn=[reactjs,typescript]'
    );
    expect(useSwrAny.mock.calls[0][0]()).toContain('perPage=20');
    expect(useSwrAny.mock.calls[0][0]()).toContain('page=2');
  });
});
