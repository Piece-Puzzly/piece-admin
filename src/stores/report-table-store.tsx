import { ReportedUser } from "@/lib/types";
import { createStore } from "zustand/vanilla";

export type ReportTableState = {
  data: ReportedUser[];
};

export type ReportTableStore = ReportTableState;

export const createReportTableStore = (initState: ReportTableState) => {
  return createStore<ReportTableStore>()(() => ({
    ...initState,
  }));
};
