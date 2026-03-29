const isDev = process.env.NODE_ENV === "development";

export const logger = {
  api: (method: string, url: string, status?: number, info?: string) => {
    if (!isDev) return;
    const emoji = !status ? "→" : status >= 400 ? "✗" : "✓";
    const infoStr = info ? ` ${info}` : "";
    console.log(
      `${emoji} [${method}] ${url}${status ? ` (${status})` : ""}${infoStr}`
    );
  },
  error: (context: string, err: unknown) => {
    if (!isDev) return;
    console.error(`✗ [${context}]`, err);
  },
};

// fetch wrapper - 요청/응답 자동 로깅
export async function apiFetch(
  url: string,
  options: RequestInit & { logInfo?: string } = {}
): Promise<Response> {
  const method = options.method || "GET";
  const { logInfo, ...fetchOptions } = options;

  // URL에서 base URL 제거하고 path만 추출
  // const baseUrl = process.env.NEXT_PUBLIC_NEXTAUTH_BASE_URL || "";
  const baseUrl = process.env.API_BASE_URL || process.env.NEXT_PUBLIC_NEXTAUTH_BASE_URL || "";
  const path = url.replace(baseUrl, "");

  const response = await fetch(url, fetchOptions);

  // 간단한 정보 출력
  logger.api(method, path, response.status, logInfo);

  return response;
}
