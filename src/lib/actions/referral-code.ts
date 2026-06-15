"use server";

import { apiClient } from "../api-client";

// 유저 추천인 코드 정보
export interface UserReferralCodeInfo {
  referralCode: string | null;
  inviteCount: number | null;
  rewardPuzzleCount: number | null;
  expired: boolean | null;
  alreadyInvited: boolean | null;
}

// GET /referral/code/{userId}  (API_BASE_URL이 /admin/v1 포함)
export async function getUserReferralCodeInfo(
  userId: number
): Promise<UserReferralCodeInfo | null> {
  return apiClient.get<UserReferralCodeInfo>(`/referral/code/${userId}`);
}
