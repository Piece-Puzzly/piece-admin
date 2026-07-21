export type UserData = {
  user_id: bigint;
  profile_id: bigint | null;
  role: string | null;
  phone: string | null;
  created_at: Date | null;
  profile: {
    nickname: string;
    birthdate: Date | null;
    profile_status: string | null;
    // 사진 보유 여부. null이면 사진 미제출(심사 대상 아님).
    image_url: string | null;
    // 프로필 승인 일시. 미승인(심사 대기/반려 등)이면 null.
    approved_at: Date | null;
  } | null;
  user_reject_history: {
    reason_image: boolean;
    reason_description: boolean;
  }[];
};

export type InitialData = {
  users: UserData[];
  totalCount: number;
  totalPages: number;
  error?: string;
};
export type SortableKey = "user_id" | "nickname" | "birthdate" | "created_at";

export type SortDirection = "asc" | "desc";

// ReviewSession 관련 타입
export type ReviewDecision = "PENDING" | "ACCEPT" | "REJECT";
export type ReviewSessionType = "INITIAL" | "UPDATE";
export type ReviewSessionStatus = "OPEN" | "COMMITTED";
export type ReviewItemType = "MAIN_IMAGE" | "ADDITIONAL_IMAGE" | "VALUE_TALK";

export interface ReviewSessionImage {
  id: number;
  itemType: ReviewItemType;
  profileImageId: number | null;
  imageUrl: string | null;
  decision: ReviewDecision;
  decidedAt: string | null;
}

export interface ReviewSession {
  sessionId: number;
  profileId: number;
  userId: number;
  sessionType: ReviewSessionType;
  status: ReviewSessionStatus;
  items: ReviewSessionImage[];
  readyToCommit: boolean;
  createdAt: string;
  committedAt: string | null;
}
