export interface Profile {
  userId: number;
  description: string;
  nickname: string;
  name: string;
  birthdate: string;
  phoneNumber: string;
  joinDate: string;
  profileStatus: string;
  rejectImage: boolean;
  rejectDescription: boolean;
}

export type ProfilesResponse = {
  status: string;
  message: string;
  data: {
    content: Profile[];
    currentPage: number;
    pageSize: number;
    totalPages: number;
    totalElements: number;
    isFirstPage: boolean;
    isLastPage: boolean;
  };
};

export interface ProfileDetail {
  imageUrl: string;
  nickname: string;
  description: string;
  responses: Question[];
}

export interface Question {
  title: string;
  category: string;
  answer: string;
}

export interface BlockedUser {
  blockedUserId: number; // 차단된 사용자 ID
  BlockedUserNickname: string; // 차단된 사용자 닉네임
  BlockedUserName: string | null; // 차단된 사용자 이름
  blockedUserBirthdate: string; // 차단된 사용자의 생년월일 (yyyy-MM-dd 형식)

  blockingUserId: number; // 차단한 사용자 ID
  blockingUserNickname: string; // 차단한 사용자 닉네임
  blockingUserName: string | null; // 차단한 사용자 이름

  BlockedDate: string; // 차단된 날짜 (yyyy-MM-dd 형식)
}

export interface BlockedUsersResponses {
  status: string;
  message: string;
  data: {
    content: BlockedUser[];
    currentPage: number;
    pageSize: number;
    totalPages: number;
    totalElements: number;
    isFirstPage: boolean;
    isLastPage: boolean;
  };
}

export interface ReportedUser {
  userId: number; // 유저 ID
  nickName: string; // 유저 닉네임
  name: string; // 유저 이름
  birthdate: string; // 유저 생년월일 (yyyy-MM-dd 형식)
  totalReportedCnt: number; // 유저가 리포트된 총 횟수
  latestReportedReason: string; // 가장 최근에 리포트된 이유
  userRole: "USER" | "BANNED";
}

export interface ReportedUsersResponses {
  status: string;
  message: string;
  data: {
    content: ReportedUser[];
    currentPage: number;
    pageSize: number;
    totalPages: number;
    totalElements: number;
    isFirstPage: boolean;
    isLastPage: boolean;
  };
}

export interface ReportDetail {
  cnt: number;
  reason: string;
  reportedDate: string;
  reporterNickName: string;
  reporterUserId: number;
}

export interface ReportDetailsResponses {
  status: string;
  message: string;
  data: {
    content: ReportDetail[];
    currentPage: number;
    pageSize: number;
    totalPages: number;
    totalElements: number;
    isFirstPage: boolean;
    isLastPage: boolean;
  };
}

export interface ReportProfile {
  userId: number; // 유저 ID
  nickName: string; // 유저 닉네임
  name: string; // 유저 이름
  birthdate: string; // 유저 생년월일 (yyyy-MM-dd 형식)
  totalReportedCnt: number; // 유저가 리포트된 총 횟수
  latestReportedReason: string; // 가장 최근에 리포트된 이유
}

// export interface MatchingProfile {
//   idA: number;
//   nicknameA: string;
//   idB: number;
//   nicknameB: string;
//   date: string;
//   time: number;
//   isMatched: boolean;
// }

export interface Photo {
  profileImageUrl: string;
  pendingProfileImage: {
    profileImageId: number;
    profileImageUrl: string;
    profileImageStatus: string;
  } | null;
}

export type MatchHistoryResponse = {
  status: string;
  message: string;
  data: MatchHistory[];
};

export type MatchHistory = {
  manualMatchId: number; // 매칭 히스토리 ID
  user1Id: number; // 첫 번째 유저 ID
  user1Nickname: string; // 첫 번째 유저 닉네임
  user2Id: number; // 두 번째 유저 ID
  user2Nickname: string; // 두 번째 유저 닉네임
  matchDateTime: string; // 예약된 매칭 시간 (ISO8601 문자열)
  isMatched: boolean; // 실제 매칭 여부
};

export type MatchCandidate = {
  userId: number; // 유저 ID
  nickName: string; // 유저 닉네임
  canBeMatched: boolean; // 해당 시간대에 수동 매칭 가능한지 여부
};

export type MatchCandidateResponse = {
  message: string;
  status: string;
  data: { candidateList: MatchCandidate[] };
};

export type User = {
  user_id: number;
  profile: {
    nickname: string;
    image_url: string | null;
  } | null;
};
