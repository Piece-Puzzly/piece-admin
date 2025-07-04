"use client";

import { type ReactNode, createContext, useContext, useRef } from "react";
import { useStore } from "zustand";

import { BlockedUser } from "@/lib/types";
import {
  BlockTableStore,
  createBlockTableStore,
} from "@/stores/block-table-store";

export type BlockTableStoreApi = ReturnType<typeof createBlockTableStore>;

export const BlockTableStoreContext = createContext<
  BlockTableStoreApi | undefined
>(undefined);

export interface BlockTableStoreProviderProps {
  children: ReactNode;
  totalNum: number;
  data: BlockedUser[];
}

export const BlockTableStoreProvider = ({
  children,
  totalNum,
  data,
}: BlockTableStoreProviderProps) => {
  const storeRef = useRef<BlockTableStoreApi | null>(null);
  if (storeRef.current === null) {
    storeRef.current = createBlockTableStore({ data, totalNum, page: 1 });
  }

  return (
    <BlockTableStoreContext.Provider value={storeRef.current}>
      {children}
    </BlockTableStoreContext.Provider>
  );
};

export const useBlockTableStore = <T,>(
  selector: (store: BlockTableStore) => T
): T => {
  const reportTableStoreContext = useContext(BlockTableStoreContext);

  if (!reportTableStoreContext) {
    throw new Error(
      `useBlockTableStore must be used within BlockTableStoreProvider`
    );
  }

  return useStore(reportTableStoreContext, selector);
};
