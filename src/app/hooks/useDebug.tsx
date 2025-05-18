import { create } from "zustand";

export const useDebug = create(() => ({
  debug: false,
}));
