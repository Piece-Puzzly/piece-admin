"use client";

import { type ReactNode, createContext, useContext, useRef } from "react";
import { useStore } from "zustand";

import { MatchHistory } from "@/lib/types";
import {
  MatchHistoryTableStore,
  createMatchHistoryTableStore,
} from "@/stores/match-history-table-store";

export type MatchHistoryTableStoreApi = ReturnType<
  typeof createMatchHistoryTableStore
>;

export const MatchHistoryTableStoreContext = createContext<
  MatchHistoryTableStoreApi | undefined
>(undefined);

export interface MatchHistoryTableStoreProviderProps {
  children: ReactNode;
  data: MatchHistory[];
}

export const MatchHistoryTableStoreProvider = ({
  children,
  data,
}: MatchHistoryTableStoreProviderProps) => {
  const storeRef = useRef<MatchHistoryTableStoreApi | null>(null);
  if (storeRef.current === null) {
    storeRef.current = createMatchHistoryTableStore({
      data,
      page: 1,
    });
  }

  return (
    <MatchHistoryTableStoreContext.Provider value={storeRef.current}>
      {children}
    </MatchHistoryTableStoreContext.Provider>
  );
};

export const useMatchHistoryTableStore = <T,>(
  selector: (store: MatchHistoryTableStore) => T
): T => {
  const reportTableStoreContext = useContext(MatchHistoryTableStoreContext);

  if (!reportTableStoreContext) {
    throw new Error(
      `useMatchHistoryTableStore must be used within MatchHistoryTableStoreProvider`
    );
  }

  return useStore(reportTableStoreContext, selector);
};
