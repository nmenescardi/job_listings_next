import { toast as toastLibrary } from 'react-toastify';

export const toast = {
  success: (message: string) =>
    toastLibrary.success(message, {
      theme: 'colored',
      style: {
        backgroundColor: '#60C87D',
      },
    }),

  error: (message: string) => toastLibrary.error(message),
};
