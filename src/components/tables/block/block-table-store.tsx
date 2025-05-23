import { Profile } from "@/lib/types";

import { createStore } from "zustand/vanilla";

export type BlockTableState = {
  data: Profile[];
};

export type BlockTableStore = BlockTableState;

export const createBlockTableStore = (initState: BlockTableState) => {
  return createStore<BlockTableStore>()(() => ({
    ...initState,
  }));
};
