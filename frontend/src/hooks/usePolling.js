import { useEffect, useRef } from 'react';

export function usePolling(callback, interval = 30000, enabled = true) {
  const savedCallback = useRef(callback);
  const intervalIdRef = useRef(null);

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    if (!enabled) {
      if (intervalIdRef.current) {
        clearInterval(intervalIdRef.current);
        intervalIdRef.current = null;
      }
      return;
    }

    const executeCallback = () => {
      try {
        savedCallback.current();
      } catch (err) {
        console.error("Error en polling:", err);
      }
    };

    intervalIdRef.current = setInterval(executeCallback, interval);

    return () => {
      if (intervalIdRef.current) {
        clearInterval(intervalIdRef.current);
        intervalIdRef.current = null;
      }
    };
  }, [interval, enabled]);
}

export default usePolling;
