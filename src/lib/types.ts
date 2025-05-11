export interface UserProfileValidationResponse {
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

export interface UserProfileValidationResponses {
  status: string;
  message: string;
  data: UserProfileValidationResponseData;
}

export interface UserProfileValidationResponseData {
  content: UserProfileValidationResponse[];
  currentPage: number;
  pageSize: number;
  totalPages: number;
  totalElements: number;
  isFirstPage: boolean;
  isLastPage: boolean;
}
export interface UserProfileDetailResponse {
  imageUrl: string;
  nickname: string;
  responses: QuestionResponseType[];
}

export interface QuestionResponseType {
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

export interface BlockedResponseData {
  content: BlockedUser[];
  currentPage: number;
  pageSize: number;
  totalPages: number;
  totalElements: number;
  isFirstPage: boolean;
  isLastPage: boolean;
}

export interface BlockedValidationResponses {
  status: string;
  message: string;
  data: BlockedResponseData;
}

export interface ReportedUser {
  userId: number; // 유저 ID
  nickName: string; // 유저 닉네임
  name: string; // 유저 이름
  birthdate: string; // 유저 생년월일 (yyyy-MM-dd 형식)
  totalReportedCnt: number; // 유저가 리포트된 총 횟수
  latestReportedReason: string; // 가장 최근에 리포트된 이유
}

export interface ReportedResponseData {
  content: ReportedUser[];
  currentPage: number;
  pageSize: number;
  totalPages: number;
  totalElements: number;
  isFirstPage: boolean;
  isLastPage: boolean;
}

export interface ReportedValidationResponses {
  status: string;
  message: string;
  data: ReportedResponseData;
}

export interface ReportDetail {
  cnt: number;
  reason: string;
  reportedDate: string;
}

export interface ReportedDetailResponseData {
  content: ReportDetail[];
  currentPage: number;
  pageSize: number;
  totalPages: number;
  totalElements: number;
  isFirstPage: boolean;
  isLastPage: boolean;
}

export interface ReportedDetailValidationResponses {
  status: string;
  message: string;
  data: ReportedDetailResponseData;
}

export interface MatchingProfile {
  idA: number;
  nicknameA: string;
  idB: number;
  nicknameB: string;
  date: string;
  time: number;
  isMatched: boolean;
}

export interface UserProfileImageDetailResponseData {
  profileImageUrl: string;
  pendingProfileImage: {
    profileImageId: number;
    profileImageUrl: string;
    profileImageStatus: string;
  } | null;
}
