export type UserData = {
  user_id: bigint;
  role: string | null;
  phone: string | null;
  created_at: Date | null;
  // 사진 심사 상태. null이면 사진 미제출(심사 대상 아님 → 사진 버튼 비활성).
  profileImageStatus: string | null;
  profile: {
    nickname: string;
    birthdate: Date | null;
    profile_status: string | null;
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
