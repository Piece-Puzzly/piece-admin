type ProfileImageData = {
  profile_image_id: bigint;
  created_at: Date | null;
  updated_at: Date | null;
  image_url: string | null;
  status: string | null;
  profile: {
    nickname: string | null;
    user_table: {
      user_id: bigint;
    } | null;
  } | null;
};

type InitialData = {
  images: ProfileImageData[];
  totalCount: number;
  totalPages: number;
  error?: string;
};
