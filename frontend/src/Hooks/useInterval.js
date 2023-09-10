import { useEffect, useRef } from "react";

export const useInterval = (cb, delay) => {
  const callback = useRef(cb);

  // We are being more explicit about not including the callback
  // in the use effect of useInterval
  useEffect(() => {
    callback.current = cb;
  });

  useEffect(() => {
    if (delay !== null) {
      const current = setInterval(callback.current, delay);
      return () => {
        clearInterval(current);
      };
    }
  }, [delay]);
};
