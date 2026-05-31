"use server";

import { apiClient } from "../api-client";

// GET /admin/v1/matches/instants/config 응답
export interface InstantMatchConfig {
  allowDuplicateMatchDays: number; // 이전 매칭 허용 날짜 기준 (n일 이전부터 허용)
  allowDuplicateMatchCount: number; // 이전 매칭 허용 매치 개수
  distanceThreshold: number; // 거리 차이 허용 정도 (값이 클수록 멀어도 허용)
  valueTalkSimilarity: number; // 가치관 유사도 기준 (0~1)
  ageGapThreshold: number; // 나이 차이 차단 허용 정도
  ageGapWeight: number; // 나이 차이 가중치
  localeDistanceWeight: number; // 거리 차이 가중치
  randomTemperature: number; // Softmax 랜덤성 정도
  totalCandidateCount: number; // 총 후보 수
  similarValueTalkCount: number; // 가치관 유사 후보 조회 수
  cachedCandidateCount: number; // 캐시 저장 후보 수
}

// GET /admin/v1/matches/basic/config 응답
export interface BasicMatchConfig {
  beforeOpenDays: number; // 같은 유저 재매칭 차단 기간 (일)
  ageWeight: number; // 나이 점수 가중치
  activityWeight: number; // 활동성 점수 가중치
  locationWeight: number; // 거리 점수 가중치
}

export async function getInstantMatchConfig(): Promise<InstantMatchConfig> {
  return apiClient.get<InstantMatchConfig>("/matches/instants/config");
}

export async function getBasicMatchConfig(): Promise<BasicMatchConfig> {
  return apiClient.get<BasicMatchConfig>("/matches/basic/config");
}

// PUT /admin/v1/matches/instants/config — body: InstantMatchConfigDto, 응답 Void
export async function updateInstantMatchConfig(
  config: InstantMatchConfig
): Promise<void> {
  await apiClient.put<void>("/matches/instants/config", config);
}

// PUT /admin/v1/matches/basic/config — body: BasicMatchConfigUpdateRequest, 응답 Void
export async function updateBasicMatchConfig(
  config: BasicMatchConfig
): Promise<void> {
  await apiClient.put<void>("/matches/basic/config", config);
}
