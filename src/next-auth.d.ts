import "next-auth";

declare module "next-auth" {
  interface Session {
    accessToken: string;
    refreshToken: string;
    loginServer: number;
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
