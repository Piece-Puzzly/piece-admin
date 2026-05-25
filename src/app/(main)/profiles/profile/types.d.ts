export type UserData = {
  user_id: bigint;
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
