import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "./auth-options";
import { logger } from "./logger";

const BASE_URL = process.env.API_BASE_URL || "";
//                         ↑ NEXT_PUBLIC_ 제거 (서버에서만 쓰므로)

class ApiError extends Error {
  constructor(
    public status: number,
    public statusText: string,
    public body?: unknown
  ) {
    super(`API Error ${status}: ${statusText}`);
  }
}

async function getAuthHeaders(): Promise<Record<string, string>> {
  const session = await getServerSession(authOptions);
  if (!session?.accessToken) {
    redirect("/login");
  }
  return {
    Authorization: `Bearer ${session.accessToken}`,
    "Content-Type": "application/json",
  };
}

async function request<T>(
  method: string,
  path: string,
  options?: { body?: unknown; params?: Record<string, string | number | undefined> }
): Promise<T> {
  const headers = await getAuthHeaders();

  let url = `${BASE_URL}${path}`;

  if (options?.params) {
    const searchParams = new URLSearchParams();
    for (const [key, value] of Object.entries(options.params)) {
      if (value !== undefined && value !== "") {
        searchParams.append(key, String(value));
      }
    }
    const qs = searchParams.toString();
    if (qs) url += `?${qs}`;
  }

  const response = await fetch(url, {
    method,
    headers,
    body: options?.body ? JSON.stringify(options.body) : undefined,
    cache: "no-store",
  });

  logger.api(method, path, response.status);

  if (response.status === 401) {
    redirect("/login");
  }

  if (!response.ok) {
    const body = await response.text().catch(() => null);
    throw new ApiError(response.status, response.statusText, body);
  }

  const text = await response.text();
  if (!text) return {} as T;

  try {
    const json = JSON.parse(text);
    // data 키가 없거나 null이면 null을 반환해 호출부에서 방어하도록 함
    return (json?.data ?? null) as T;
  } catch {
    // 응답 본문이 JSON이 아니거나 손상된 경우 방어
    return {} as T;
  }
}

export const apiClient = {
  get: <T>(path: string, params?: Record<string, string | number | undefined>) =>
    request<T>("GET", path, { params }),

  post: <T>(path: string, body?: unknown) =>
    request<T>("POST", path, { body }),

  patch: <T>(path: string, body?: unknown) =>
    request<T>("PATCH", path, { body }),

  delete: <T>(path: string, body?: unknown) =>
    request<T>("DELETE", path, { body }),
};

export { ApiError };