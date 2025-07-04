import { getReportedDatas } from "@/lib/server";
import { ReportedUser } from "@/lib/types";
import { toast } from "sonner";
import { createStore } from "zustand/vanilla";

export type ReportTableState = {
  data: ReportedUser[];
  totalNum: number;
  page: number;
};
export type ReportTableActions = {
  update: (page: number) => void;
};

export type ReportTableStore = ReportTableState & ReportTableActions;

export const createReportTableStore = (initState: ReportTableState) => {
  return createStore<ReportTableStore>()((set) => ({
    ...initState,
    update: async (page: number) => {
      const data = await getReportedDatas(page - 1);
      if (!data) {
        toast("not authenticated");
        return;
      }
      set({ data: data.data.content, totalNum: data.data.totalElements });
    },
  }));
};
