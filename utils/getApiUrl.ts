import { FiltersType } from '@/utils/types';
import { API_DOMAIN } from '@/hooks/common';

export const getApiUrl = (
  activeFilters: FiltersType,
  perPage: number,
  currentPage: number
): string => {
  const onlyRemoteArg = `onlyRemote=${!!activeFilters?.onlyRemote ? '1' : '0'}`;

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
