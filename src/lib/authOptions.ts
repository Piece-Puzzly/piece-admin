import { NextAuthOptions, User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { loginServerInfo } from "./loginData";

export const authOptions: NextAuthOptions = {
  secret: process.env.AUTH_SECRET,
  providers: [
    ...[0, 1].map((i) =>
      CredentialsProvider({
        id: `${loginServerInfo[i].name}-login`,
        name: "Credentials",
        credentials: {
          loginId: { label: "loginId", type: "text" },
          password: { label: "password", type: "password" },
        },
        async authorize(credentials) {
          const res = await fetch(loginServerInfo[i].baseUrl + "/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              loginId: credentials?.loginId,
              password: credentials?.password,
            }),
          });

          if (res.ok) {
            const { data } = await res.json();
            return {
              id: credentials?.loginId,
              accessToken: data.accessToken,
              refreshToken: data.refreshToken,
              loginServer: i,
            } as User;
          }
          return null;
        },
      })
    ),
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
