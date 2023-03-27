import { FiltersType } from '@/utils/types';
import { API_DOMAIN, fetcher, swrOptions } from '@/hooks/common';
import useSWR from 'swr';

const useListings = (
  activeFilters: FiltersType,
  perPage: number,
  currentPage = 1
) => {
  const getApiUrl = () => {
    const onlyRemoteArg = `onlyRemote=${
      !!activeFilters?.onlyRemote ? '1' : '0'
    }`;

    let url = `${API_DOMAIN}/listings?${onlyRemoteArg}`;

    if (activeFilters?.provider && activeFilters?.provider?.length > 0) {
      url +=
        '&providersIn=[' +
        activeFilters?.provider?.map((provider) => provider.value).join(',') +
        ']';
    }

    if (activeFilters?.tags && activeFilters?.tags?.length > 0) {
      url +=
        '&tagsIn=[' +
        activeFilters?.tags?.map((tag) => tag.value).join(',') +
        ']';
    }

    url += `&perPage=${perPage}`;

    url += `&page=${currentPage}`;

    return url;
  };

  const { data, isLoading, error } = useSWR(getApiUrl(), fetcher, swrOptions);

  return { data, isLoading, error };
};

export default useListings;
