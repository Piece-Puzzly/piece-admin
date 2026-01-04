"use server";

import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "./auth-options";
import { apiFetch, logger } from "./logger";

import { revalidatePath } from "next/cache";
import {
  BlockedUsersResponses,
  MatchCandidateResponse,
  MatchHistoryResponse,
  Profile,
  ProfilesResponse,
  ReportedUsersResponses,
} from "./types";

export async function getProfiles(page: number): Promise<ProfilesResponse> {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/login");
  }
  const response = await apiFetch(
    process.env.NEXT_PUBLIC_NEXTAUTH_BASE_URL +
      `/users?page=${page}&size=${10}`,

    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
      },
      cache: "no-store",
    }
  );

  if (!response.ok) {
    redirect("/login");
  }

  const res = await response.json();

  return res as ProfilesResponse;
}

export async function getFilteredProfile(
  select: "userId" | "profileId" | "nickname",
  value: string
): Promise<Profile> {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/login");
  }
  const response = await apiFetch(
    process.env.NEXT_PUBLIC_NEXTAUTH_BASE_URL +
      `/users/search?` +
      `${select}=${value}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
      },
      cache: "no-store",
    }
  );

  const res: Profile = (await response.json()).data;

  return res;
}

export async function updateProfileStatus(
  userId: number,
  rejectImage: boolean,
  rejectDescription: boolean
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return;
  }

  const response = await apiFetch(
    process.env.NEXT_PUBLIC_NEXTAUTH_BASE_URL + `/users/${userId}/profile`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.accessToken}`,
      },
      body: JSON.stringify({
        rejectImage,
        rejectDescription,
      }),
    }
  );

  const response_json = await response.json();
  revalidatePath("/profiles/profile");
  return response_json;
}

export const getUserById = async (userId: number) => {
  const session = await getServerSession(authOptions);
  if (!session) {
    return;
  }
  const response = await apiFetch(
    process.env.NEXT_PUBLIC_NEXTAUTH_BASE_URL + `/users/${userId}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${session?.accessToken}`,
      },
      cache: "no-store",
    }
  );

  const response_json = await response.json();

  return response_json;
};

export const getBlockDatas = async (page: number = 0, size: number = 10) => {
  const session = await getServerSession(authOptions);
  if (!session) {
    return;
  }
  const response = await apiFetch(
    process.env.NEXT_PUBLIC_NEXTAUTH_BASE_URL +
      `/blocks?page=${page}&size=${size}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${session?.accessToken}`,
      },
      cache: "no-store",
    }
  );

  const response_json: BlockedUsersResponses = await response.json();

  return response_json;
};

export async function getReportedDatas(
  page: number = 0,
  size: number = 10
): Promise<ReportedUsersResponses | null> {
  const session = await getServerSession(authOptions);
  if (!session) {
    return null;
  }
  const response = await apiFetch(
    process.env.NEXT_PUBLIC_NEXTAUTH_BASE_URL +
      `/reports?page=${page}&size=${size}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${session?.accessToken}`,
      },
      cache: "no-store",
    }
  );

  const response_json = await response.json();

  return response_json as ReportedUsersResponses;
}

export const getReportDetail = async (
  userId: number,
  page: number = 0,
  size: number = 10
) => {
  const session = await getServerSession(authOptions);
  if (!session) {
    return;
  }
  const response = await apiFetch(
    process.env.NEXT_PUBLIC_NEXTAUTH_BASE_URL +
      `/reports/users/${userId}?page=${page}&size=${size}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${session?.accessToken}`,
      },
      cache: "no-store",
    }
  );

  const response_json = await response.json();

  return response_json;
};

export const banUsers = async (userId: number) => {
  const session = await getServerSession(authOptions);
  if (!session) {
    return;
  }

  const response = await apiFetch(
    process.env.NEXT_PUBLIC_NEXTAUTH_BASE_URL + `/bans/users`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${session?.accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId,
      }),
      cache: "no-store",
    }
  );

  const response_json = await response.json();

  return response_json;
};

export async function getUserProfileImageDetail(userId: number) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return;
  }
  const response = await apiFetch(
    process.env.NEXT_PUBLIC_NEXTAUTH_BASE_URL + `/users/${userId}/profileImage`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${session?.accessToken}`,
      },
      cache: "no-store",
    }
  );
  const response_json = await response.json();

  return response_json;
}

export async function UpdateProfileImageStatus(
  profileImageId: number,
  accepted: boolean
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return;
  }
  const response = await apiFetch(
    process.env.NEXT_PUBLIC_NEXTAUTH_BASE_URL +
      `/profileImages/${profileImageId}`,
    {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${session?.accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        accepted,
      }),
      cache: "no-store",
    }
  );

  const response_json = await response.json();
  revalidatePath("/profiles/photo");

  return response_json;
}

export async function getMatchHistory(
  page: number
): Promise<undefined | MatchHistoryResponse> {
  const session = await getServerSession(authOptions);
  if (!session) {
    return;
  }
  const response = await apiFetch(
    process.env.NEXT_PUBLIC_NEXTAUTH_BASE_URL +
      `/manual-match/history` +
      `?page=${page}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${session?.accessToken}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    }
  );

  const response_json = (await response.json()) as MatchHistoryResponse;

  return response_json;
}

export async function getMatchCandidate(
  page: number
): Promise<undefined | MatchCandidateResponse> {
  const session = await getServerSession(authOptions);
  if (!session) {
    return;
  }
  const response = await apiFetch(
    process.env.NEXT_PUBLIC_NEXTAUTH_BASE_URL +
      `/manual-match/candidates` +
      `?page=${page}`,
    // `?match-time=${new Date().toISOString().slice(0, 19)}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${session?.accessToken}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    }
  );

  const response_json = (await response.json()) as MatchCandidateResponse;

  return response_json;
}

export async function reserveMatch(
  user1Id: number,
  user2Id: number,
  dateTime: string,
  matchType: string
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return;
  }
  const response = await apiFetch(
    process.env.NEXT_PUBLIC_NEXTAUTH_BASE_URL + `/manual-match`,

    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${session?.accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ user1Id, user2Id, dateTime, matchType }),

      cache: "no-store",
    }
  );

  const response_json = (await response.json()) as MatchCandidateResponse;

  return response_json;
}

export async function cancelMatch(matchId: number) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return;
  }
  const response = await apiFetch(
    process.env.NEXT_PUBLIC_NEXTAUTH_BASE_URL + `/manual-match`,

    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${session?.accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ manualMatchId: matchId }),

      cache: "no-store",
    }
  );

  const response_json = (await response.json()) as MatchCandidateResponse;

  return response_json;
}

export async function setPaidMatchStatus(params: {
  matchId: number;
  user1Id: number;
  user2Id: number;
  user1Status: string;
  user2Status: string;
  user1AcceptPaid: boolean;
  user1ImagePaid: boolean;
  user1ContactPaid: boolean;
  user2AcceptPaid: boolean;
  user2ImagePaid: boolean;
  user2ContactPaid: boolean;
}) {
  const session = await getServerSession(authOptions);
  if (!session) {
    logger.error("setPaidMatchStatus", "No session found");
    return;
  }

  const response = await apiFetch(
    process.env.NEXT_PUBLIC_NEXTAUTH_BASE_URL + `/manual-match/paid`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${session?.accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(params),
      cache: "no-store",
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    let errorMessage = "요청 처리 중 오류가 발생했습니다.";
    try {
      const errorJson = JSON.parse(errorText);
      errorMessage = errorJson.message || errorMessage;
    } catch {
      // JSON 파싱 실패 시 기본 메시지 사용
    }
    throw new Error(errorMessage);
  }

  const responseText = await response.text();

  if (!responseText) {
    return { success: true };
  }

  return JSON.parse(responseText);
}

export async function setFreeMatchStatus(params: {
  matchId: number;
  user1Id: number;
  user2Id: number;
  user1Status: string;
  user2Status: string;
}) {
  const session = await getServerSession(authOptions);
  if (!session) {
    logger.error("setFreeMatchStatus", "No session found");
    return;
  }

  const response = await apiFetch(
    process.env.NEXT_PUBLIC_NEXTAUTH_BASE_URL + `/manual-match/free`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${session?.accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(params),
      cache: "no-store",
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed: ${response.status} - ${errorText}`);
  }

  return await response.json();
}
