"use server";

import { apiClient } from "../api-client";

// 유저 보유 퍼즐 수 (일반/이벤트)
export interface PuzzleInfo {
  generalPuzzleCount: number | null;
  eventPuzzleCount: number | null;
}

// 이벤트(리워드) 퍼즐 지급 이력 1건
export interface RewardPuzzle {
  puzzleType: string | null;
  createdAt: string | null;
  remainingCount: number | null;
  dueDate: string | null;
}

// 조회: GET /puzzle?userId=  (API_BASE_URL이 /admin/v1 포함)
export async function getPuzzleInfo(
  userId: number
): Promise<PuzzleInfo | null> {
  return apiClient.get<PuzzleInfo>("/puzzle", { userId });
}

// 조회: GET /puzzle/rewards/info?userId=  (이벤트 퍼즐 지급 이력)
export async function getRewardPuzzleHistory(
  userId: number
): Promise<RewardPuzzle[]> {
  const res = await apiClient.get<RewardPuzzle[]>("/puzzle/rewards/info", {
    userId,
  });
  return res ?? [];
}

// 퍼즐 타입. (REWARD = 이벤트 퍼즐, 확정값) TODO(BE 확인): GENERAL 등 나머지 enum 값 확인.
export type PuzzleType = "GENERAL" | "REWARD";

/**
 * 특정 유저에게 퍼즐을 직접 지급한다. (운영 보상 대응 등)
 * POST /puzzle/grant  body: { userId, puzzleType, puzzleCount, expiryDate }
 * - puzzleCount: 1 이상의 정수
 * - expiryDate: 만료일수(이벤트 퍼즐용). 일반 퍼즐은 0.
 */
export async function grantPuzzle(
  userId: number,
  puzzleType: PuzzleType,
  puzzleCount: number,
  expiryDate: number
): Promise<void> {
  if (!Number.isInteger(puzzleCount) || puzzleCount <= 0) {
    throw new Error("지급 수량은 1 이상의 정수여야 합니다.");
  }
  await apiClient.post<void>("/puzzle/grant", {
    userId,
    puzzleType,
    puzzleCount,
    expiryDate,
  });
}
