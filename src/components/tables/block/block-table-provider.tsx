"use client";

import { type ReactNode, createContext, useContext, useRef } from "react";
import { useStore } from "zustand";

import {
  type BlockTableStore,
  createBlockTableStore,
} from "@/components/tables/block/block-table-store";
import { Profile } from "@/lib/types";

export type BlockTableStoreApi = ReturnType<typeof createBlockTableStore>;

export const BlockTableStoreContext = createContext<
  BlockTableStoreApi | undefined
>(undefined);

export interface BlockTableStoreProviderProps {
  children: ReactNode;
  data: Profile[];
}

export const BlockTableStoreProvider = ({
  children,
  data,
}: BlockTableStoreProviderProps) => {
  const storeRef = useRef<BlockTableStoreApi | null>(null);
  if (storeRef.current === null) {
    storeRef.current = createBlockTableStore({ data });
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
  const blockTableStoreContext = useContext(BlockTableStoreContext);

  if (!blockTableStoreContext) {
    throw new Error(
      `useBlockTableStore must be used within BlockTableStoreProvider`
    );
  }

  return useStore(blockTableStoreContext, selector);
};
