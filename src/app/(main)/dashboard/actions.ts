"use server";

import { checkAuth } from "@/lib/actions/auth";
import prisma from "@/lib/prisma";
import type { daily_kpi as DailyKpi } from "@prisma/client";
import { profile_profile_status } from "@prisma/client";

export type RecentReport = {
  id: number;
  reason: string | null;
  createdAt: Date | null;
  reporter: string | null;
  reporterId: number;
  reportedUser: string | null;
  reportedUserId: number;
};

export async function getRecentReports(): Promise<{
  data: RecentReport[] | null;
  error: string | null;
}> {
  await checkAuth();
  try {
    const reports = await prisma.report.findMany({
      orderBy: { created_at: "desc" },
      take: 5,
      select: {
        report_id: true,
        reason: true,
        created_at: true,
        reporter_user_id: true,
        reported_user_id: true,
        user_table_report_reporter_user_idTouser_table: {
          select: {
            profile: { select: { nickname: true } },
          },
        },
        user_table_report_reported_user_idTouser_table: {
          select: {
            profile: { select: { nickname: true } },
          },
        },
      },
    });

    const formattedData: RecentReport[] = reports.map((report) => {
      const reporterNickname =
        report.user_table_report_reporter_user_idTouser_table?.profile
          ?.nickname;
      const reportedUserNickname =
        report.user_table_report_reported_user_idTouser_table?.profile
          ?.nickname;

      return {
        id: Number(report.report_id),
        reason: report.reason,
        createdAt: report.created_at,
        reporter: reporterNickname || null,
        reporterId: Number(report.reporter_user_id),
        reportedUser: reportedUserNickname || null,
        reportedUserId: Number(report.reported_user_id),
      };
    });

    return { data: formattedData, error: null };
  } catch (error) {
    console.error("Failed to fetch recent reports:", error);
    return { data: null, error: "신고 내역을 불러오는 데 실패했습니다." };
  }
}

export type IncompleteProfile = {
  profileId: number;
  createdAt: Date | null;
  userId: number;
  nickname: string | null;
  status: profile_profile_status | null;
};

export async function getIncompleteProfiles(): Promise<{
  data: IncompleteProfile[] | null;
  error: string | null;
}> {
  await checkAuth();
  try {
    const profiles = await prisma.profile.findMany({
      where: {
        profile_status: {
          in: ["INCOMPLETE", "REVISED"],
        },
        user_table: {
          isNot: null,
        },
      },
      orderBy: { created_at: "asc" },
      select: {
        profile_id: true,
        created_at: true,
        nickname: true,
        profile_status: true,
        user_table: {
          select: { user_id: true },
        },
      },
    });

    const formattedData: IncompleteProfile[] = profiles.map((profile) => ({
      profileId: Number(profile.profile_id),
      createdAt: profile.created_at,
      userId: Number(profile.user_table!.user_id),
      nickname: profile.nickname,
      status: profile.profile_status,
    }));

    return { data: formattedData, error: null };
  } catch (error) {
    console.error("Failed to fetch incomplete profiles:", error);
    return {
      data: null,
      error: "처리 대기중인 프로필을 불러오는 데 실패했습니다.",
    };
  }
}

export async function getProfilesWithPendingImages() {
  await checkAuth();
  try {
    const profiles = await prisma.profile.findMany({
      where: {
        profile_image: {
          some: { status: "PENDING" },
        },
        user_table: {
          isNot: null,
        },
      },
      select: {
        nickname: true,
        user_table: {
          select: { user_id: true },
        },
        profile_image: {
          select: {
            image_url: true,
            status: true,
            created_at: true,
          },
          orderBy: { created_at: "asc" },
        },
      },
    });

    const result = profiles.map((profile) => {
      const userId = profile.user_table!.user_id;
      const pendingImages = profile.profile_image.filter(
        (img) => img.status === "PENDING" && img.image_url
      );

      const changeTimestamp =
        pendingImages.length > 0 ? pendingImages[0].created_at : null;

      return {
        userId,
        nickname: profile.nickname,
        changeTimestamp,
        newImages: pendingImages.map((img) => img.image_url!),
      };
    });

    return { data: result };
  } catch (error) {
    console.error("Failed to fetch profiles with pending images:", error);
    return { data: [], error: "데이터를 불러오는 데 실패했습니다." };
  }
}

export type KpiData = {
  [K in keyof DailyKpi]: DailyKpi[K] extends bigint | bigint | null
    ? number
    : DailyKpi[K];
};

const convertBigInts = (data: DailyKpi | null): KpiData | null => {
  if (!data) return null;
  const result: { [key: string]: unknown } = {};
  for (const key in data) {
    const value = data[key as keyof DailyKpi];
    if (typeof value === "bigint") {
      result[key] = Number(value);
    } else {
      result[key] = value;
    }
  }
  return result as KpiData;
};

export async function getRecentKpiHistory(): Promise<{
  data: KpiData[] | null;
  error: string | null;
}> {
  try {
    const historyData: DailyKpi[] = await prisma.daily_kpi.findMany({
      orderBy: { target_date: "desc" },
      take: 5,
    });

    const convertedHistory = historyData.map(convertBigInts);

    return {
      data: convertedHistory.filter((item): item is KpiData => item !== null),
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
