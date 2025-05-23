import { Profile } from "@/lib/types";

import { createStore } from "zustand/vanilla";

export type PhotoTableState = {
  data: Profile[];
};

export type PhotoTableStore = PhotoTableState;

export const createPhotoTableStore = (initState: PhotoTableState) => {
  return createStore<PhotoTableStore>()(() => ({
    ...initState,
  }));
};
