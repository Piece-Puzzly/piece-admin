"use client";

import { type ReactNode, createContext, useContext, useRef } from "react";
import { useStore } from "zustand";

import { ReportDetail } from "@/lib/types";
import {
  createReportDetailTableStore,
  ReportDetailTableStore,
} from "@/stores/report-detail-table-store";

export type ReportDetailTableStoreApi = ReturnType<
  typeof createReportDetailTableStore
>;

export const ReportDetailTableStoreContext = createContext<
  ReportDetailTableStoreApi | undefined
>(undefined);

export interface ReportDetailTableStoreProviderProps {
  id: number;
  children: ReactNode;
  totalNum: number;
  data: ReportDetail[];
}

export const ReportDetailTableStoreProvider = ({
  id,
  children,
  totalNum,
  data,
}: ReportDetailTableStoreProviderProps) => {
  const storeRef = useRef<ReportDetailTableStoreApi | null>(null);
  if (storeRef.current === null) {
    storeRef.current = createReportDetailTableStore({
      id,
      data,
      totalNum,
      page: 1,
    });
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
      `useReportTableStore must be used within ReportTableStoreProvider`
    );
  }

  return useStore(reportDetailTableStoreContext, selector);
};
