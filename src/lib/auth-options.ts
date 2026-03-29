import { NextAuthOptions, User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

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
        console.log("[auth] calling:", process.env.NEXT_PUBLIC_NEXTAUTH_BASE_URL + "/auth/login");
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
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.accessToken = user.accessToken;
        token.refreshToken = user.refreshToken;
        token.loginServer = user.loginServer;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id as string;
      session.accessToken = token.accessToken as string;
      session.refreshToken = token.refreshToken as string;
      session.loginServer = token.loginServer as number;

      return session;
    },
  },
};
