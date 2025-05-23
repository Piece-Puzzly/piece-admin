import { Profile } from "@/lib/types";

import { createStore } from "zustand/vanilla";

export type ReportDetailTableState = {
  data: Profile[];
};

export type ReportDetailTableStore = ReportDetailTableState;

export const createReportDetailTableStore = (
  initState: ReportDetailTableState
) => {
  return createStore<ReportDetailTableStore>()(() => ({
    ...initState,
  }));
};
