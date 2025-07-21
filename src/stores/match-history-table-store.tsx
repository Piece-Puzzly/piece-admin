import { getMatchHistory } from "@/lib/server";
import { MatchHistory } from "@/lib/types";
import { toast } from "sonner";
import { createStore } from "zustand/vanilla";

export type MatchHistoryTableState = {
  data: MatchHistory[];
  // totalNum: number;
  page: number;
};

export type MatchHistoryTableActions = {
  update: (page: number) => Promise<void>;
  reload: () => Promise<void>;
};

export type MatchHistoryTableStore = MatchHistoryTableState &
  MatchHistoryTableActions;

export const createMatchHistoryTableStore = (
  initState: MatchHistoryTableState
) => {
  return createStore<MatchHistoryTableStore>()((set, get) => ({
    ...initState,

    update: async (page: number) => {
      const res = await getMatchHistory(page - 1);
      if (res) {
        set({ data: res.data, page });
      } else {
        toast(String(res));
      }
    },
    reload: async () => {
      const { page, update } = get();
      await update(page);
    },
  }));
};
