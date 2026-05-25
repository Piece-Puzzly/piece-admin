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

// TODO(BE 확정 필요): 퍼즐 지급(POST) 엔드포인트. 경로/바디 확정 후 이 부분만 수정.
const grantPuzzlePath = () => `/puzzle`;

/**
 * 특정 유저에게 퍼즐을 직접 지급한다. (운영 보상 대응 등)
 * 수량은 1 이상의 정수여야 한다.
 */
export async function grantPuzzle(
  userId: number,
  amount: number
): Promise<void> {
  if (!Number.isInteger(amount) || amount <= 0) {
    throw new Error("지급 수량은 1 이상의 정수여야 합니다.");
  }
  await apiClient.post<void>(grantPuzzlePath(), { userId, amount });
}
