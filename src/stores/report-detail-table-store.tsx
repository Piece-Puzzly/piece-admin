import { getReportDetail } from "@/lib/server";
import { ReportDetail } from "@/lib/types";
import { toast } from "sonner";
import { createStore } from "zustand/vanilla";

export type ReportDetailTableState = {
  id: number;
  data: ReportDetail[];
  totalNum: number;
  page: number;
};
export type ReportDetailTableActions = {
  update: (page: number) => void;
};

export type ReportDetailTableStore = ReportDetailTableState &
  ReportDetailTableActions;

export const createReportDetailTableStore = (
  initState: ReportDetailTableState
) => {
  return createStore<ReportDetailTableStore>()((set, get) => ({
    ...initState,
    update: async (page: number) => {
      const { id } = get();
      const data = await getReportDetail(id, page - 1);

      if (!data) {
        toast("not authenticated");
        return;
      }
      set({ data: data.content, totalNum: data.totalElements, page });
    },
  }));
};
