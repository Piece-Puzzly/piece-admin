import { NextAuthOptions, User } from "next-auth";
import { JWT } from "next-auth/jwt";
import CredentialsProvider from "next-auth/providers/credentials";

// 세션 수명 = refreshToken 수명(14일)에 맞춤
const SESSION_MAX_AGE = 60 * 60 * 24 * 14;
// 만료 30초 전 미리 갱신
const EXPIRY_BUFFER_MS = 30_000;

// JWT accessToken의 exp(초) → ms. 디코드 실패 시 null (이 경우 강제 갱신하지 않음).
function getTokenExpiry(jwt?: string): number | null {
  if (!jwt) return null;
  try {
    const payload = jwt.split(".")[1];
    if (!payload) return null;
    const decoded = Buffer.from(
      payload.replace(/-/g, "+").replace(/_/g, "/"),
      "base64"
    ).toString("utf8");
    const json = JSON.parse(decoded);
    return typeof json.exp === "number" ? json.exp * 1000 : null;
  } catch {
    return null;
  }
}

// refreshToken으로 accessToken 재발급. 실패 시 error 플래그를 단다.
async function refreshAccessToken(token: JWT): Promise<JWT> {
  try {
    const res = await fetch(
      process.env.NEXT_PUBLIC_NEXTAUTH_BASE_URL + "/auth/refresh",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken: token.refreshToken }),
      }
    );
    if (!res.ok) throw new Error(`refresh failed: ${res.status}`);

    const { data } = await res.json();
    return {
      ...token,
      accessToken: data.accessToken,
      refreshToken: data.refreshToken ?? token.refreshToken,
      accessTokenExpires: getTokenExpiry(data.accessToken),
      error: undefined,
    };
  } catch {
    // 재발급 실패 → 호출부에서 /login으로 보내도록 표시 (기존 동작과 동일)
    return { ...token, error: "RefreshAccessTokenError" };
  }
}

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    CredentialsProvider({
      id: `${process.env.NEXT_PUBLIC_NEXTAUTH_NAME}-login`,
      name: "Credentials",
      credentials: {
        loginId: { label: "loginId", type: "text" },
        password: { label: "password", type: "password" },
      },
      async authorize(credentials) {
        const res = await fetch(
          process.env.NEXT_PUBLIC_NEXTAUTH_BASE_URL + "/auth/login",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              loginId: credentials?.loginId,
              password: credentials?.password,
            }),
          }
        );

        if (res.ok) {
          const { data } = await res.json();
          return {
            id: credentials?.loginId,
            accessToken: data.accessToken,
            refreshToken: data.refreshToken,
          } as User;
        }
        return null;
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: SESSION_MAX_AGE,
  },
  callbacks: {
    async jwt({ token, user }) {
      // 1) 최초 로그인: 토큰 저장 + accessToken 만료시간 기록
      if (user) {
        return {
          ...token,
          id: user.id,
          accessToken: user.accessToken,
          refreshToken: user.refreshToken,
          loginServer: user.loginServer,
          accessTokenExpires: getTokenExpiry(user.accessToken),
        };
      }

      // 2) 만료시간을 모르거나(파싱 실패) 아직 유효하면 그대로 사용 (무회귀)
      if (
        token.accessTokenExpires == null ||
        Date.now() < token.accessTokenExpires - EXPIRY_BUFFER_MS
      ) {
        return token;
      }

      // 3) accessToken 만료 → refreshToken으로 재발급 시도
      return await refreshAccessToken(token);
    },
    async session({ session, token }) {
      session.user.id = token.id ?? null;
      session.accessToken = token.accessToken as string;
      session.refreshToken = token.refreshToken as string;
      session.loginServer = token.loginServer as number;
      session.error = token.error;
      return session;
    },
  },
};
