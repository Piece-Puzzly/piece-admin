"use client";

import { type ReactNode, createContext, useContext, useRef } from "react";
import { useStore } from "zustand";

import {
  type ReportDetailTableStore,
  createReportDetailTableStore,
} from "@/components/tables/report-detail/report-detail-table-store";
import { Profile } from "@/lib/types";

export type ReportDetailTableStoreApi = ReturnType<
  typeof createReportDetailTableStore
>;

export const ReportDetailTableStoreContext = createContext<
  ReportDetailTableStoreApi | undefined
>(undefined);

export interface ReportDetailTableStoreProviderProps {
  children: ReactNode;
  data: Profile[];
}

export const ReportDetailTableStoreProvider = ({
  children,
  data,
}: ReportDetailTableStoreProviderProps) => {
  const storeRef = useRef<ReportDetailTableStoreApi | null>(null);
  if (storeRef.current === null) {
    storeRef.current = createReportDetailTableStore({ data });
  }

  return (
    <ReportDetailTableStoreContext.Provider value={storeRef.current}>
      {children}
    </ReportDetailTableStoreContext.Provider>
  );
};

export const useReportDetailTableStore = <T,>(
  selector: (store: ReportDetailTableStore) => T
): T => {
  const reportDetailTableStoreContext = useContext(
    ReportDetailTableStoreContext
  );

  if (!reportDetailTableStoreContext) {
    throw new Error(
      `useReportDetailTableStore must be used within ReportDetailTableStoreProvider`
    );
  }

  return useStore(reportDetailTableStoreContext, selector);
};
