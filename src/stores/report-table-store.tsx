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
  update: (page?: number) => Promise<void>;
};

export type ReportTableStore = ReportTableState & ReportTableActions;

export const createReportTableStore = (initState: ReportTableState) => {
  return createStore<ReportTableStore>()((set, get) => ({
    ...initState,
    update: async (page?: number) => {
      page = page ?? get().page;

      const data = await getReportedDatas(page - 1);
      console.log(data);
      if (!data) {
        toast("not authenticated");
        return;
      }
      set({ data: data.data.content, totalNum: data.data.totalElements, page });
    },
  }));
};
