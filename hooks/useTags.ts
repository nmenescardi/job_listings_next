import useSWR from 'swr';
import { API_DOMAIN, fetcher, swrOptions } from '@/hooks/common';

const useTags = () => {
  const { data, isLoading, error } = useSWR(
    `${API_DOMAIN}/tags`,
    fetcher,
    swrOptions
  );

  return { data, isLoading, error };
};

export default useTags;
