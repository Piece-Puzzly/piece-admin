export type UserData = {
  user_id: bigint;
  role: string | null;
  phone: string | null;
  created_at: Date | null;
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
