import { Profile } from "@/lib/types";

import { createStore } from "zustand/vanilla";

export type ReportTableState = {
  data: Profile[];
};

export type ReportTableStore = ReportTableState;

export const createReportTableStore = (initState: ReportTableState) => {
  return createStore<ReportTableStore>()(() => ({
    ...initState,
  }));
};
