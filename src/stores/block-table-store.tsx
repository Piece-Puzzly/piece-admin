import { getBlockDatas } from "@/lib/server";
import { BlockedUser } from "@/lib/types";
import { toast } from "sonner";
import { createStore } from "zustand/vanilla";

export type BlockTableState = {
  data: BlockedUser[];
  totalNum: number;
  page: number;
};
export type BlockTableActions = {
  update: (page: number) => void;
};

export type BlockTableStore = BlockTableState & BlockTableActions;

export const createBlockTableStore = (initState: BlockTableState) => {
  return createStore<BlockTableStore>()((set) => ({
    ...initState,
    update: async (page: number) => {
      const data = await getBlockDatas(page - 1);
      if (!data) {
        toast("not authenticated");
        return;
      }
      set({ data: data.data.content, totalNum: data.data.totalElements });
    },
  }));
};
