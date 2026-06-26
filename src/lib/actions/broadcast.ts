"use server";

import { apiClient } from "../api-client";

export interface BroadcastStats {
  activeUserCount: number;
  fcmRegisteredUserCount: number;
}

export type NotificationType =
  | "PROFILE_APPROVED"
  | "PROFILE_REJECTED"
  | "PROFILE_IMAGE_APPROVED"
  | "PROFILE_IMAGE_REJECTED"
  | "MATCH_NEW"
  | "MATCH_ACCEPTED"
  | "MATCH_COMPLETED"
  | "PUZZLE_EXPIRE"
  | "REWARD_PUZZLE_TO_INVITER"
  | "INCOMPLETE_PROFILE"
  | "REJECT_REMIND"
  | "EVENT";

export type PuzzleType = "GENERIC" | "REWARD";

/**
 * 브로드캐스트 대상 통계 조회
 */
export async function getBroadcastStats(): Promise<BroadcastStats> {
  const res = await apiClient.get<BroadcastStats>("/broadcast/stats");
  return res ?? { activeUserCount: 0, fcmRegisteredUserCount: 0 };
}

/**
 * 전체 유저에게 푸시 알림 발송
 */
export async function sendNotificationToAll(
  title: string,
  body: string,
  notificationType: NotificationType
): Promise<void> {
  await apiClient.post<void>("/broadcast/notification", {
    title,
    body,
    notificationType,
  });
}

/**
 * 전체 활성 유저에게 퍼즐 지급
 */
export async function grantPuzzleToAll(
  puzzleType: PuzzleType,
  puzzleCount: number,
  expiryDays: number
): Promise<void> {
  if (!Number.isInteger(puzzleCount) || puzzleCount <= 0) {
    throw new Error("지급 수량은 1 이상의 정수여야 합니다.");
  }
  await apiClient.post<void>("/broadcast/puzzle", {
    puzzleType,
    puzzleCount,
    expiryDays,
  });
}
