"use client";

import { type ReactNode, createContext, useContext, useRef } from "react";
import { useStore } from "zustand";

import {
  type ReportTableStore,
  createReportTableStore,
} from "@/components/tables/report/report-table-store";
import { Profile } from "@/lib/types";

export type ReportTableStoreApi = ReturnType<typeof createReportTableStore>;

export const ReportTableStoreContext = createContext<
  ReportTableStoreApi | undefined
>(undefined);

export interface ReportTableStoreProviderProps {
  children: ReactNode;
  data: Profile[];
}

export const ReportTableStoreProvider = ({
  children,
  data,
}: ReportTableStoreProviderProps) => {
  const storeRef = useRef<ReportTableStoreApi | null>(null);
  if (storeRef.current === null) {
    storeRef.current = createReportTableStore({ data });
  }

  return (
    <ReportTableStoreContext.Provider value={storeRef.current}>
      {children}
    </ReportTableStoreContext.Provider>
  );
};

export const useReportTableStore = <T,>(
  selector: (store: ReportTableStore) => T
): T => {
  const reportTableStoreContext = useContext(ReportTableStoreContext);

  if (!reportTableStoreContext) {
    throw new Error(
      `useReportTableStore must be used within ReportTableStoreProvider`
    );
  }

  return useStore(reportTableStoreContext, selector);
};
