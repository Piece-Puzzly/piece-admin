"use client";

import { type ReactNode, createContext, useContext, useRef } from "react";
import { useStore } from "zustand";

import {
  type PhotoTableStore,
  createPhotoTableStore,
} from "@/components/tables/photo/photo-table-store";
import { Profile } from "@/lib/types";

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
    storeRef.current = createPhotoTableStore({ data });
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
