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
