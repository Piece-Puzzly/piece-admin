import "next-auth";

declare module "next-auth" {
  interface Session {
    accessToken: string;
    refreshToken: string;
    loginServer: number;
    error?: string;
    user: {
      id: string | null;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }

  interface User {
    accessToken: string;
    refreshToken: string;
    loginServer: number;
    id: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string | null;
    accessToken?: string;
    refreshToken?: string;
    loginServer?: number;
    // accessToken 만료시각(ms). null이면 만료 판정 불가 → 강제 갱신 안 함.
    accessTokenExpires?: number | null;
    error?: string;
  }
}
