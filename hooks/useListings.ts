import { FiltersType } from '@/utils/types';
import { API_DOMAIN, fetcher, swrOptions } from '@/hooks/common';
import useSWR from 'swr';
import { getApiUrl } from '@/utils/getApiUrl';

const useListings = (
  activeFilters: FiltersType,
  perPage: number,
  currentPage = 1
) => {
  const { data, isLoading, error } = useSWR(
    () => getApiUrl(activeFilters, perPage, currentPage),
    fetcher,
    swrOptions
  );

  return { data, isLoading, error };
};

export default useListings;
