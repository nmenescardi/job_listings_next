'use client';
import useSWR from 'swr';
import axios from '@/utils/axios';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface UseAuthProps {
  middleware?: string;
  redirectIfAuthenticated?: string;
}

export const useAuth = ({
  middleware,
  redirectIfAuthenticated = 'admin/listings/',
}: UseAuthProps = {}) => {
  const router = useRouter();

  const {
    data: user,
    error,
    mutate,
  } = useSWR(
    '/api/user',
    () =>
      axios
        .get('/api/user') // Returns logged in user
        .then((res) => res.data)
        .catch((error) => {
          if (error.response.status !== 409) throw error;

          router.push('/verify-email');
        }),
    {
      refreshInterval: 0, //60000, // One minute
    }
  );

  const csrf = () => axios.get('/sanctum/csrf-cookie');

  type LoginProps = {
    setApiError: React.Dispatch<React.SetStateAction<string>>;
    [key: string]: any;
  };

  const login = async ({
    setApiError,
    ...props
  }: LoginProps): Promise<void> => {
    await csrf();

    setApiError('');

    axios
      .post('/api/auth/login', props)

      .then(() => mutate())
      .catch((error) => {
        setApiError(error?.response?.data?.message);
        if (error.response?.status !== 422) throw error;
      });
  };

  const logout = async () => {
    await csrf();

    await axios
      .post('/api/auth/logout')
      .then(() => mutate())
      .catch((error) => console.error(error))
      .finally(() => {
        router.push('/auth/login');
      });
  };

  useEffect(() => {
    if (middleware === 'guest' && redirectIfAuthenticated && user && !error) {
      router.push(redirectIfAuthenticated);
    }

    if (
      window.location.pathname === '/verify-email' &&
      user?.email_verified_at
    ) {
      router.push(redirectIfAuthenticated);
    }

    if (middleware === 'auth' && error) {
      logout();
    }
  }, [user, error]);

  return {
    user,
    login,
    logout,
  };
};
