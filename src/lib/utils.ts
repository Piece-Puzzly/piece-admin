import { clsx, type ClassValue } from "clsx";
import { ReadonlyURLSearchParams } from "next/navigation";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const DEFAULT_PROFILE_IMAGE = "/default-profile.svg";

/**
 * next/image의 src로 안전한 값을 반환한다.
 * null·undefined·빈 문자열·"null"·https가 아닌 값은 기본 프로필 이미지로 대체해
 * "Failed to construct 'URL': Invalid URL" 크래시를 방지한다.
 */
export function getImageSrc(url: string | null | undefined): string {
  if (!url || typeof url !== "string") return DEFAULT_PROFILE_IMAGE;
  const trimmed = url.trim();
  if (trimmed === "" || trimmed === "null") return DEFAULT_PROFILE_IMAGE;
  if (!trimmed.startsWith("https://")) return DEFAULT_PROFILE_IMAGE;
  // "https://"로 시작해도 호스트가 없거나 깨진 값은 next/image의 new URL()에서
  // "Invalid URL"로 크래시하므로, 실제로 파싱 가능한 URL인지 검증한다.
  try {
    new URL(trimmed);
    return trimmed;
  } catch {
    return DEFAULT_PROFILE_IMAGE;
  }
}
export function formatPhoneNumber(number: string): string {
  const digits = number.replace(/\D/g, "");

  if (digits.startsWith("02")) {
    return digits.replace(/^(\d{2})(\d{3,4})(\d{4})$/, "$1-$2-$3");
  } else if (digits.startsWith("01")) {
    return digits.replace(/^(\d{3})(\d{3,4})(\d{4})$/, "$1-$2-$3");
  } else {
    return digits.replace(/^(\d{3})(\d{3,4})(\d{4})$/, "$1-$2-$3");
  }
}

export function getPagesNumber(
  currPage: number,
  totalNum: number,
  numberPerPage: number
) {
  const pageNum = Math.ceil(totalNum / numberPerPage);

  const pagesPerScreen = Math.min(pageNum, 5);

  if (currPage === 1) {
    return [
      currPage,
      currPage + 1,
      currPage + 2,
      currPage + 3,
      currPage + 4,
    ].slice(0, pagesPerScreen);
  } else if (currPage === 2) {
    return [
      currPage - 1,
      currPage,
      currPage + 1,
      currPage + 2,
      currPage + 3,
    ].slice(0, pagesPerScreen);
  } else if (currPage === pageNum) {
    return [
      currPage - 4,
      currPage - 3,
      currPage - 2,
      currPage - 1,
      currPage,
    ].slice(5 - pagesPerScreen, 6);
  } else if (currPage === pageNum - 1) {
    return [
      currPage - 3,
      currPage - 2,
      currPage - 1,
      currPage,
      currPage + 1,
    ].slice(5 - pagesPerScreen, 6);
  } else {
    return [currPage - 2, currPage - 1, currPage, currPage + 1, currPage + 2];
  }
}

export const createQueryString = (
  searchParams: ReadonlyURLSearchParams,
  query: { key: string; value?: string }[]
) => {
  const params = new URLSearchParams(searchParams.toString());
  for (const { key, value } of query) {
    if (value === undefined) {
      params.delete(key);
    } else {
      params.set(key, value);
    }
  }

  return params.toString();
};

export function toLocaleString(date: Date | string | number): string {
  if (typeof date === "string" || typeof date === "number") {
    date = new Date(date);
  }
  return date.toLocaleString("ko-KR", {
    timeZone: "UTC",
  });
}

export function toLocaleDateString(date: Date | string | number): string {
  if (typeof date === "string" || typeof date === "number") {
    date = new Date(date);
  }
  return date.toLocaleDateString("ko-KR", {
    timeZone: "UTC",
  });
}
