import { user_table } from "@prisma/client";

export const profileStatusInfo = [
  { key: "REJECTED", value: "보류", name: "반려", color: "#FF3059" },
  { key: "INCOMPLETE", value: "미완료", name: "미완료", color: "#6F00FB" },
  { key: "REVISED", value: "수정 제출", name: "수정 제출", color: "#22CB52" },
  { key: "APPROVED", value: "통과", name: "통과", color: "#CBD1D9" },
];

export const contactsMap: Record<string, string> = {
  KAKAO_TALK_ID: "카카오톡 아이디",
  PHONE_NUMBER: "전화번호",
  OPEN_CHAT_URL: "카카오톡 오픈채팅방",
  INSTAGRAM_ID: "인스타 아이디",
};

export const roleNameMap: Record<string, string> = {
  NONE: "미인증",
  REGISTER: "프로필 미작성",
  PENDING: "심사 미완료",
  USER: "정상",
};
export const ruleColumnsMap: Record<string, keyof user_table | "nickname"> = {
  
};
