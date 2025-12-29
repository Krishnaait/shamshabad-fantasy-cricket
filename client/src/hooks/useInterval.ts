import { useEffect, useRef } from 'react';

/**
 * Hook to run a callback at regular intervals
 * Automatically cleans up on unmount
 * @param callback - Function to run at each interval
 * @param delay - Delay in milliseconds (null to disable)
 */
export function useInterval(callback: (() => void) | null, delay: number | null) {
  const savedCallback = useRef<(() => void) | null>(null);

  // Remember the latest callback
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval
  useEffect(() => {
    function tick() {
      if (savedCallback.current) {
        savedCallback.current();
      }
    }

    if (delay !== null && callback !== null) {
      const id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay, callback]);
}
