import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
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
