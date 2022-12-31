import { useState, useCallback, useRef, useEffect } from "react";
import { ERROR_UNKNOWN } from "../util/Constants";

export const useHttpClient = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const activeHttpRequests = useRef<AbortController[]>([]);

  const BACKEND_URL = "http://localhost:5000/api/";

  const sendRequest = useCallback(
    async (
      url: string,
      method = "GET",
      body: BodyInit | null = null,
      headers = {}
    ) => {
      setIsLoading(true);
      const httpAbortCtrl = new AbortController();
      activeHttpRequests.current.push(httpAbortCtrl);

      try {
        const response = await fetch(BACKEND_URL + url, {
          method,
          body,
          headers,
          signal: httpAbortCtrl.signal,
        });

        const responseData = await response.json();

        activeHttpRequests.current = activeHttpRequests.current.filter(
          (reqCtrl) => reqCtrl !== httpAbortCtrl
        );

        if (!response.ok) {
          throw new Error(responseData.message);
        }

        setIsLoading(false);
        return responseData;
      } catch (err: Error | any) {
        setError(err.message || ERROR_UNKNOWN);
        setIsLoading(false);
        throw err;
      }
    },
    []
  );

  const clearError = () => {
    setError(null);
  };

  useEffect(() => {
    return () => {
      activeHttpRequests.current.forEach((abortCtrl) => abortCtrl.abort());
    };
  }, []);

  return { isLoading, error, sendRequest, clearError };
};
