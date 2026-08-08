// 심사 대기중인 PENDING 이미지 정보
export interface PendingImageInfo {
  profileImageId: number;
  type: "MAIN" | "ADDITIONAL";
  imageUrl: string;
  displayOrder: number | null;
}

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
  // 심사 대기중인 PENDING 이미지 목록
  pendingImages?: PendingImageInfo[];
};

export type InitialData = {
  users: UserData[];
  totalCount: number;
  totalPages: number;
  error?: string;
};

export type SortableKey = "user_id" | "nickname" | "birthdate" | "created_at";

export type SortDirection = "asc" | "desc";

// ═══════════════════════════════════════════════════════════════════════════
// 프로필 심사 API (단일 API)
// ═══════════════════════════════════════════════════════════════════════════

// 심사 결정
export type ReviewDecision = "ACCEPT" | "REJECT";

// 심사 타입 (서버에서 user.role 기반으로 자동 판단)
// - INITIAL: role=PENDING (신규 심사, 이미지 + 가치관톡)
// - UPDATE: role=USER (사진 변경 심사, 이미지만)
export type ReviewType = "INITIAL" | "UPDATE";

// 이미지 심사 결정
export interface ImageDecision {
  profileImageId: number;
  decision: ReviewDecision;
}

// 심사 요청
export interface ProfileReviewRequest {
  imageDecisions: ImageDecision[];
  valueTalkDecision?: ReviewDecision; // INITIAL(role=PENDING)일 때만 필수
}

// 이미지 심사 결과
export interface ImageResult {
  profileImageId: number;
  imageType: string;       // MAIN, ADDITIONAL
  decision: string;        // ACCEPT, REJECT
  resultStatus: string;    // ACCEPTED, REJECTED
}

// 심사 응답
export interface ProfileReviewResponse {
  profileId: number;
  userId: number;
  reviewType: ReviewType;
  resultStatus: string;    // APPROVED, REJECTED
  imageResults: ImageResult[];
  valueTalkResult: string | null; // ACCEPT, REJECT (INITIAL만)
}