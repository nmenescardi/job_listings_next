import { FiltersType, Listing } from '@/utils/types';
import { API_DOMAIN, fetcher, swrOptions } from '@/hooks/common';
import useSWR, { mutate, useSWRConfig } from 'swr';
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

const createListingUpdater = (apiEndpoint, newStatus) => {
  return () => {
    const { cache, mutate } = useSWRConfig();

    const updateListingStatus = async (listingId) => {
      try {
        const response = await axios.post(
          `${API_DOMAIN}/listings/${listingId}${apiEndpoint}`
        );

        if (
          200 === response.status &&
          newStatus === response?.data?.application.status
        ) {
          for (const key of cache.keys()) {
            if (key.startsWith(`${API_DOMAIN}/listings`)) {
              mutate<Listing[]>(key, (currentData: Listing[] | undefined) => {
                const currentListings = currentData as Listing[];

                if (currentListings && Array.isArray(currentListings)) {
                  const listingIndex = currentListings.findIndex(
                    (listing) => listing.id === listingId
                  );

                  if (listingIndex !== -1) {
                    const updatedListing = {
                      ...currentListings[listingIndex],
                      status: newStatus,
                    };

                    return [
                      ...currentListings.slice(0, listingIndex),
                      updatedListing,
                      ...currentListings.slice(listingIndex + 1),
                    ];
                  }
                }
                return currentListings;
              });
            }
          }
        }
      } catch (error) {
        console.error(`Error setting listing as ${newStatus}`, error);
      }
    };

    return updateListingStatus;
  };
};

export const useSetListingAsVisited = createListingUpdater(
  '/application/viewed',
  'viewed'
);

export const useSetListingAsApplied = createListingUpdater(
  '/application/applied',
  'applied'
);

export default useListings;
