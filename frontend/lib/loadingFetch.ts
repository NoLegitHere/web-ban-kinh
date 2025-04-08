'use client';

import { useGlobalLoading } from '@/hooks/useGlobalLoading';

export const useLoadingFetch = () => {
  const { startLoading, stopLoading } = useGlobalLoading();

  const fetchWithLoading = async <T>(
    fetchFn: () => Promise<T>,
    message: string = 'Đang tải dữ liệu...'
  ): Promise<T> => {
    startLoading(message);
    try {
      return await fetchFn();
    } finally {
      stopLoading();
    }
  };

  return { fetchWithLoading };
}; 