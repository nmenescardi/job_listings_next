import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { providersList } from '@/data/providers';
import { FiltersType } from '@/utils/types';

export const initialFilters: FiltersType = {
  onlyRemote: false,
  provider: undefined,
  tags: undefined,
};

export const useFilters = () => {
  const [activeFilters, setActiveFilters] =
    useState<FiltersType>(initialFilters);
  const [newFilters, setNewFilters] = useState<FiltersType>(initialFilters);

  const searchParams = useSearchParams();
  useEffect(() => {
    if (!searchParams) return;

    // Get params from URL
    const onlyRemote = '1' === searchParams.get('onlyRemote');
    const providersInArg = searchParams.get('providersIn') ?? '';
    const tagsInArg = searchParams.get('tagsIn') ?? '';
    const locationsInArg = searchParams.get('locationsIn') ?? '';

    const providersIn = providersInArg
      .split(',')
      .filter((provider) => providersList.includes(provider));
    const tagsIn = tagsInArg.split(',').filter((tag) => tag.length > 0);
    const locationsIn = locationsInArg
      .split(',')
      .filter((location) => location.length > 0);

    const changeFiltersCallback = (filters: FiltersType) => ({
      ...filters,
      provider: providersIn.map((provider) => ({
        label: provider,
        value: provider,
      })),
      tags: tagsIn.map((tag) => ({
        label: tag,
        value: tag,
      })),
      locations: locationsIn.map((location) => ({
        label: location,
        value: location,
      })),
      onlyRemote,
    });

    setActiveFilters(changeFiltersCallback);
    setNewFilters(changeFiltersCallback);
  }, [searchParams]);

  return { activeFilters, newFilters, setNewFilters, setActiveFilters };
};
