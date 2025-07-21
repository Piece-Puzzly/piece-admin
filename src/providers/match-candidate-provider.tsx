"use client";

import { type ReactNode, createContext, useContext, useRef } from "react";
import { useStore } from "zustand";

import {
  createMatchCandidateStore,
  MatchCandidateStore,
} from "@/stores/match-candidate-store";

export type MatchCandidateStoreApi = ReturnType<
  typeof createMatchCandidateStore
>;

export const MatchCandidateStoreContext = createContext<
  MatchCandidateStoreApi | undefined
>(undefined);

export interface MatchCandidateStoreProviderProps {
  children: ReactNode;
}

export const MatchCandidateStoreProvider = ({
  children,
}: MatchCandidateStoreProviderProps) => {
  const storeRef = useRef<MatchCandidateStoreApi | null>(null);
  if (storeRef.current === null) {
    storeRef.current = createMatchCandidateStore({
      selectedUsers: [undefined, undefined],
      data: undefined,
      page: 1,
    });
  }

  return (
    <MatchCandidateStoreContext.Provider value={storeRef.current}>
      {children}
    </MatchCandidateStoreContext.Provider>
  );
};

export const useMatchCandidateStore = <T,>(
  selector: (store: MatchCandidateStore) => T
): T => {
  const reportTableStoreContext = useContext(MatchCandidateStoreContext);

  if (!reportTableStoreContext) {
    throw new Error(
      `useMatchCandidateStore must be used within MatchCandidateStoreProvider`
    );
  }

  return useStore(reportTableStoreContext, selector);
};
