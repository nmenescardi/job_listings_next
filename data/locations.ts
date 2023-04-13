import { Locations } from '@/utils/types';

export const locations: Locations[] = [
  { value: 'United States', label: 'United States' },
];

export const locationsList = locations.map((provider) => provider.value);
