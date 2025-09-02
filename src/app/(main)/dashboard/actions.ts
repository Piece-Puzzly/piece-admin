"use server";

import { checkAuth } from "@/lib/actions/auth";
import prisma from "@/lib/prisma";
import { profile_profile_status } from "@prisma/client";

// 데이터 객체 타입을 두 종류의 데이터를 포함하도록 확장합니다.

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
  await checkAuth();
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
  await checkAuth();
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
export async function getProfilesWithPendingImages() {
  try {
    const profiles = await prisma.profile.findMany({
      where: {
        profile_image: {
          some: {
            status: "PENDING",
          },
        },
        user_table: {
          isNot: null,
        },
      },
      select: {
        nickname: true,
        user_table: {
          select: {
            user_id: true,
          },
        },
        profile_image: {
          select: {
            image_url: true,
            status: true,
            created_at: true,
          },
          orderBy: {
            created_at: "asc",
          },
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
        userId: userId,
        nickname: profile.nickname,
        changeTimestamp: changeTimestamp,
        newImages: profile.profile_image
          .filter((img) => img.status === "PENDING" && img.image_url)
          .map((img) => img.image_url!),
      };
    });

    return { data: result };
  } catch (error) {
    console.error("Failed to fetch profiles with pending images:", error);
    return { data: [], error: "데이터를 불러오는 데 실패했습니다." };
  }
}
