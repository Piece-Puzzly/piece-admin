import { useEffect, useState } from "react";

export const useMount = (): boolean => {
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    if (isMounted === true) {
      return;
    }
    setIsMounted(true);
  }, [isMounted]);
  return isMounted;
};
