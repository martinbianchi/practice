import { useCallback, useEffect, useReducer, useRef } from "react";

export const useDebounce = (cb, delay, deps) => {
  const timeout = useRef(null);
  const [cancel, cancelFn] = useReducer((val) => !val, false);
  const status = useRef(null);

  const isReady = useCallback(() => {
    return status.current;
  }, []);

  const setTimeoutCallback = useCallback(() => {
    status.current = false;
    timeout.current = setTimeout(() => {
      cb();
      status.current = true;
    }, delay);
  }, delay);

  const clearTimeoutCallback = useCallback(() => {
    console.log("cancelling!");
    timeout.current && clearTimeout(timeout.current);
  }, []);

  useEffect(() => {
    setTimeoutCallback();

    return () => clearTimeout(timeout.current);
  }, deps);

  useEffect(clearTimeoutCallback, [cancel]);

  return [isReady, cancelFn];
};
