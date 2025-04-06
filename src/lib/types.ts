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
