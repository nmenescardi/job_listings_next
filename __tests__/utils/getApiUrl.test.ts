import { FiltersType } from '@/utils/types';
import { getApiUrl } from '@/utils/getApiUrl';
import { API_DOMAIN } from '@/hooks/common';

describe('getApiUrl', () => {
  test('generates URL with only required parameters', () => {
    const activeFilters: FiltersType = {
      onlyRemote: false,
      provider: [],
      tags: [],
    };
    const perPage = 10;
    const currentPage = 1;

    const expectedUrl = `${API_DOMAIN}/listings?onlyRemote=0&perPage=10&page=1`;
    expect(getApiUrl(activeFilters, perPage, currentPage)).toBe(expectedUrl);
  });

  test('generates URL with all filter parameters', () => {
    const activeFilters: FiltersType = {
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
    const perPage = 20;
    const currentPage = 2;

    const expectedUrl = `${API_DOMAIN}/listings?onlyRemote=1&providersIn=[Indeed,LinkedIn]&tagsIn=[reactjs,typescript]&perPage=20&page=2`;
    expect(getApiUrl(activeFilters, perPage, currentPage)).toBe(expectedUrl);
  });
});
