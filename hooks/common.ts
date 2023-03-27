const API_TOKEN = process.env.NEXT_PUBLIC_API_AUTH_TOKEN;

export const API_DOMAIN = process.env.NEXT_PUBLIC_API_URL;

export const fetcher = (...args: Parameters<typeof fetch>) => {
  const [url, ...rest] = args;
  const headers = {
    Authorization: `Bearer ${API_TOKEN}`,
  };

  return fetch(url, { headers, credentials: 'include', ...rest }).then(
    async (res) => res.json()
  );
};

export const swrOptions = {
  dedupingInterval: 180000, // 180 seconds or 3 minutes
};
