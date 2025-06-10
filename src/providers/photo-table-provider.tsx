"use client";

import { type ReactNode, createContext, useContext, useRef } from "react";
import { useStore } from "zustand";

import { Profile } from "@/lib/types";
import {
  type PhotoTableStore,
  createPhotoTableStore,
} from "@/stores/photo-table-store";

export type PhotoTableStoreApi = ReturnType<typeof createPhotoTableStore>;

export const PhotoTableStoreContext = createContext<
  PhotoTableStoreApi | undefined
>(undefined);

export interface PhotoTableStoreProviderProps {
  children: ReactNode;
  data: Profile[];
}

export const PhotoTableStoreProvider = ({
  children,
  data,
}: PhotoTableStoreProviderProps) => {
  const storeRef = useRef<PhotoTableStoreApi | null>(null);
  if (storeRef.current === null) {
    storeRef.current = createPhotoTableStore({
      data,
      selectValue: 0,
      inputValue: "",
    });
  }

  return (
    <PhotoTableStoreContext.Provider value={storeRef.current}>
      {children}
    </PhotoTableStoreContext.Provider>
  );
};

export const usePhotoTableStore = <T,>(
  selector: (store: PhotoTableStore) => T
): T => {
  const photoTableStoreContext = useContext(PhotoTableStoreContext);

  if (!photoTableStoreContext) {
    throw new Error(
      `usePhotoTableStore must be used within PhotoTableStoreProvider`
    );
  }

  return useStore(photoTableStoreContext, selector);
};
