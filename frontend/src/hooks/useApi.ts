import { useState, useCallback } from 'react';
import axios, { AxiosRequestConfig, AxiosError } from 'axios';

interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

interface UseApiReturn<T> extends UseApiState<T> {
  execute: (config?: AxiosRequestConfig) => Promise<T | null>;
  reset: () => void;
}

export function useApi<T = any>(initialConfig?: AxiosRequestConfig): UseApiReturn<T> {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const execute = useCallback(async (config?: AxiosRequestConfig): Promise<T | null> => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const response = await axios({
        ...initialConfig,
        ...config,
      });
      
      setState({
        data: response.data,
        loading: false,
        error: null,
      });

      return response.data;
    } catch (err) {
      const error = err as AxiosError;
      let errorMessage = 'An unexpected error occurred';

      if (error.response) {
        // Server responded with error status
        const responseData = error.response.data as any;
        errorMessage = responseData?.message || `Error ${error.response.status}`;
      } else if (error.request) {
        // Network error
        errorMessage = 'Network error. Please check your connection.';
      } else {
        // Other error
        errorMessage = error.message || 'An unexpected error occurred';
      }

      setState({
        data: null,
        loading: false,
        error: errorMessage,
      });

      return null;
    }
  }, [initialConfig]);

  const reset = useCallback(() => {
    setState({
      data: null,
      loading: false,
      error: null,
    });
  }, []);

  return {
    ...state,
    execute,
    reset,
  };
} 