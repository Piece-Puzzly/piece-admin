"use server";

import prisma from "@/lib/prisma";
import { profile_profile_status } from "@prisma/client";

// 데이터 객체 타입을 두 종류의 데이터를 포함하도록 확장합니다.
export type DailyStat = {
  date: string;
  signups: number;
  profiles: number;
};

export async function getDailyStats(): Promise<{
  data: DailyStat[] | null;
  error: string | null;
}> {
  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const [userSignups, profileRegistrations] = await Promise.all([
      // 1. First query (total signups) remains the same.
      prisma.$queryRaw<{ date: Date; count: bigint }[]>`
        SELECT DATE(created_at) as date, CAST(COUNT(*) AS UNSIGNED) as count 
        FROM user_table 
        WHERE created_at >= ${thirtyDaysAgo}
        GROUP BY DATE(created_at)
      `,

      // ## 2. This is the modified query ##
      // It now targets 'user_table' and filters for role = 'user'.
      prisma.$queryRaw<{ date: Date; count: bigint }[]>`
        SELECT DATE(created_at) as date, CAST(COUNT(*) AS UNSIGNED) as count 
        FROM user_table
        WHERE created_at >= ${thirtyDaysAgo} AND role = ${"user"}
        GROUP BY DATE(created_at)
      `,
    ]);

    const signupCounts = new Map<string, number>();
    userSignups.forEach((item) =>
      signupCounts.set(
        item.date.toISOString().split("T")[0],
        Number(item.count)
      )
    );

    const profileCounts = new Map<string, number>();
    profileRegistrations.forEach((item) =>
      profileCounts.set(
        item.date.toISOString().split("T")[0],
        Number(item.count)
      )
    );

    const allDates = Array.from({ length: 30 }).map((_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (29 - i));
      return date.toISOString().split("T")[0];
    });

    const fullStats = allDates.map((dateStr) => ({
      date: dateStr,
      signups: signupCounts.get(dateStr) || 0,
      profiles: profileCounts.get(dateStr) || 0,
    }));

    return { data: fullStats, error: null };
  } catch (error) {
    console.error("Failed to fetch daily stats:", error);
    return { data: null, error: "데이터를 가져오는 데 실패했습니다." };
  } finally {
    await prisma.$disconnect();
  }
}

export type RecentReport = {
  id: number;
  reason: string | null;
  createdAt: Date | null;
  reporter: string | null;
  reporterId: number; // 신고자 ID 추가
  reportedUser: string | null;
  reportedUserId: number; // 신고 대상 ID 추가
};

export async function getRecentReports(): Promise<{
  data: RecentReport[] | null;
  error: string | null;
}> {
  try {
    const reports = await prisma.report.findMany({
      orderBy: { created_at: "desc" },
      take: 10,
      include: {
        user_table_report_reporter_user_idTouser_table: true,
        user_table_report_reported_user_idTouser_table: true,
      },
    });

    const formattedData: RecentReport[] = reports.map((report) => ({
      // 2. 반환되는 객체에 ID들을 추가하고, BigInt를 Number로 변환합니다.
      id: Number(report.report_id),
      reason: report.reason,
      createdAt: report.created_at,
      reporter: report.user_table_report_reporter_user_idTouser_table.name,
      reporterId: Number(report.reporter_user_id), // 신고자 ID 추가
      reportedUser: report.user_table_report_reported_user_idTouser_table.name,
      reportedUserId: Number(report.reported_user_id), // 신고 대상 ID 추가
    }));

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
  try {
    const profiles = await prisma.profile.findMany({
      where: {
        // 2. Use the 'in' operator to filter for both statuses.
        profile_status: {
          in: ["INCOMPLETE", "REVISED"],
        },
        user_table: {
          isNot: null,
        },
      },
      orderBy: {
        created_at: "asc",
      },
      include: {
        user_table: true,
      },
    });

    const formattedData: IncompleteProfile[] = profiles.map((profile) => ({
      profileId: Number(profile.profile_id),
      createdAt: profile.created_at,
      userId: Number(profile.user_table!.user_id),
      nickname: profile.nickname,
      // 3. Pass the status in the formatted data.
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
