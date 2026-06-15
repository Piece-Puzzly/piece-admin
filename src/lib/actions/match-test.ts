"use server";

import { apiClient } from "../api-client";

// 응답 구조 (백엔드 BasicFilterTestResponse)
// Jackson은 Map<Long, Set<Long>>를 키가 문자열인 JSON object로 직렬화한다.
export interface BasicFilterTestResult {
  allowedProfilesById: Record<string, number[]>;
}

// 응답 구조 (백엔드 InstantlFilterTestResponse)
// reason은 MatchFailReason enum 이름 (예: "SUCCESS", "AGE_GAP" 등)
export interface InstantFilterTestResult {
  reason: string;
}

// 기본 매칭 필터 테스트: 주어진 userIds 각각에 대해 매칭 가능한 프로필 ID 집합을 조회한다.
// 호출 경로: ${API_BASE_URL}/matches/test/basic (admin prefix 적용됨)
export async function testBasicMatch(
  userIds: number[]
): Promise<BasicFilterTestResult> {
  if (userIds.length === 0) {
    return { allowedProfilesById: {} };
  }
  // 백엔드 @RequestParam List<Long>는 ?userIds=1,2,3 형태(콤마 구분)를 자동 분해한다.
  return apiClient.get<BasicFilterTestResult>("/matches/test/basic", {
    userIds: userIds.join(","),
  });
}

// 즉시 매칭 필터 테스트: 두 유저 사이 매칭 가부와 실패 사유를 조회한다.
export async function testInstantMatch(
  requestUserId: number,
  targetUserId: number
): Promise<InstantFilterTestResult> {
  return apiClient.get<InstantFilterTestResult>("/matches/test/instants", {
    requestUserId,
    targetUserId,
  });
}
