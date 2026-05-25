"use server";

import { apiClient } from "../api-client";

// TODO(BE 확정 필요): 퍼즐 지급 엔드포인트.
// 실제 경로/바디가 확정되면 이 한 줄만 수정하면 된다.
// 가정: POST /users/{userId}/puzzles  body: { amount }
const grantPuzzlePath = (userId: number) => `/users/${userId}/puzzles`;

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
  await apiClient.post<void>(grantPuzzlePath(userId), { amount });
}
