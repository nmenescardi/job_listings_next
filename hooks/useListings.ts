import { FiltersType } from '@/utils/types';
import { API_DOMAIN, fetcher, swrOptions } from '@/hooks/common';
import useSWR from 'swr';
import { getApiUrl } from '@/utils/getApiUrl';
import axios from '@/utils/axios';

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

// TODO: use SWR and mutations
export const setListingAsVisited = async (listingId: number) => {
  await axios.get('/sanctum/csrf-cookie');
  await axios
    .post(`${API_DOMAIN}/listings/${listingId}/application/viewed`)
    .then((res) => console.log(res.data))
    .catch((response) => console.error(response));
};

export default useListings;
