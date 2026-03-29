"use server";

import { checkAuth } from "@/lib/actions/auth";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { apiClient } from "@/lib/api-client";

export type RecentReport = {
  id: number;
  reason: string | null;
  createdAt: Date | null;
  reporter: string | null;
  reporterId: number;
  reportedUser: string | null;
  reportedUserId: number;
};

interface RecentReportApiResponse {
  id: number;
  reason: string | null;
  createdAt: string | null;
  reporter: string | null;
  reporterId: number | null;
  reportedUser: string | null;
  reportedUserId: number | null;
}

export async function getRecentReports(): Promise<{
  data: RecentReport[] | null;
  error: string | null;
}> {

  try {
    const reports : RecentReportApiResponse[] = await apiClient.get<RecentReportApiResponse[]>("/dashboard/recent-reports", {
      limit: "5",
    });
  
    const formattedData: RecentReport[] = reports.map((report) => ({
      id: report.id,
      reason: report.reason,
      createdAt: report.createdAt ? new Date(report.createdAt) : null,
      reporter: report.reporter,
      reporterId: report.reporterId ?? 0,
      reportedUser: report.reportedUser,
      reportedUserId: report.reportedUserId ?? 0,
    }));
    return { data: formattedData, error: null };
  } catch (error) {
    console.error("Failed to fetch recent reports:", error);
    return { data: null, error: "신고 내역을 불러오는 데 실패했습니다." };
  }
}

export type ProfileStatus = "INCOMPLETE" | "REVISED" | "APPROVED" | "REJECTED" | null;

export type IncompleteProfile = {
  profileId: number;
  createdAt: Date | null;
  userId: number;
  nickname: string | null;
  status: ProfileStatus;
};

interface IncompleteProfileApiResponse {
  profileId: number;
  createdAt: string | null;
  userId: number | null;
  nickname: string | null;
  status: string | null;
}

export async function getIncompleteProfiles(): Promise<{
  data: IncompleteProfile[] | null;
  error: string | null;
}> {

  try {

    const profiles : IncompleteProfileApiResponse[] = await apiClient.get<IncompleteProfileApiResponse[]>("/dashboard/pending-profiles");

    const formattedData: IncompleteProfile[] = profiles.map((profile) => ({
      profileId: profile.profileId,
      createdAt: profile.createdAt ? new Date(profile.createdAt) : null,
      userId: profile.userId ?? 0,
      nickname: profile.nickname,
      status: profile.status as ProfileStatus,
    }));

    return { data: formattedData, error: null };
  } catch (error) {
    console.error("Failed to fetch incomplete profiles:", error);
    return { data: null, error: "처리 대기중인 프로필을 불러오는 데 실패했습니다." };
  }
}

interface PendingImageProfileApiResponse {
  userId: number;
  nickname: string | null;
  changeTimestamp: string | null;
  newImages: string[];
}

export async function getProfilesWithPendingImages() {
  try {
    const profiles : PendingImageProfileApiResponse[] = await apiClient.get<PendingImageProfileApiResponse[]>("/dashboard/pending-images");
    const result = profiles.map((profile) => ({
      userId: BigInt(profile.userId),
      nickname: profile.nickname,
      changeTimestamp: profile.changeTimestamp ? new Date(profile.changeTimestamp) : null,
      newImages: profile.newImages,
    }));

    return { data: result };
  } catch (error) {
    console.error("Failed to fetch profiles with pending images:", error);
    return { data: [], error: "데이터를 불러오는 데 실패했습니다." };
  }
}

export type KpiData = {
  id: number;
  targetDate: string | null;
  // Matching KPI
  createdMatchCount: number | null;
  uncheckedMatchUserCount: number | null;
  checkedMatchUserCount: number | null;
  acceptedMatchUserCount: number | null;
  refusedMatchUserCount: number | null;
  blockedMatchUserCount: number | null;
  mutuallyAcceptedMatchCount: number | null;
  // User Growth KPI
  newUserCount: number | null;
  registerStatusUserCount: number | null;
  createdProfileUserCount: number | null;
  approvedProfileUserCount: number | null;
  // User Activity KPI
  activeUserCount: number | null;
};

interface KpiApiResponse {
  id: number;
  targetDate: string | null;
  createdMatchCount: number | null;
  uncheckedMatchUserCount: number | null;
  checkedMatchUserCount: number | null;
  acceptedMatchUserCount: number | null;
  refusedMatchUserCount: number | null;
  blockedMatchUserCount: number | null;
  mutuallyAcceptedMatchCount: number | null;
  newUserCount: number | null;
  registerStatusUserCount: number | null;
  createdProfileUserCount: number | null;
  approvedProfileUserCount: number | null;
  activeUserCount: number | null;
}

export async function getRecentKpiHistory(): Promise<{
  data: KpiData[] | null;
  error: string | null;
}> {

  try {
    const kpiList : KpiApiResponse[] = await apiClient.get<KpiApiResponse[]>("/dashboard/kpi-history", {
      days: "5",
    });

        return {
      data: kpiList,
      error: null,
    };
  } catch (error) {
    console.error("Error fetching recent KPI history:", error);
    return {
      data: null,
      error: "최근 KPI 기록을 가져오는 데 실패했습니다.",
    };
  }
}
