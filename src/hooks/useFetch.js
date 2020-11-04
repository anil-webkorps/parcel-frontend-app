import { useState, useEffect, useCallback } from "react";
import request from "utils/request";

export default function useFetch(url, options, immediate = false) {
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const execute = useCallback(
    async (signal) => {
      setLoading(true);
      try {
        const res = await request(url, options);
        const json = await res.json();
        if (!signal.aborted) {
          setResponse(json);
        }
      } catch (e) {
        if (!signal.aborted) {
          setError(e);
        }
      } finally {
        if (!signal.aborted) {
          setLoading(false);
        }
      }
    },
    [url, options]
  );

  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;

    if (immediate) {
      execute(signal);
    }
    return () => {
      abortController.abort();
    };
  }, [options, url, immediate, execute]);
  return { response, error, loading, execute };
}
