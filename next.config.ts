import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */

  env: {
    NEXTAUTH_SECRET: "dL0dhbBFKMgRWcjKIB6ud+VbO4RXkH1Pj1r8tqOSbrw=",
    NEXT_PUBLIC_NEXTAUTH_NAME: process.env.NEXT_PUBLIC_NEXTAUTH_NAME,
    NEXT_PUBLIC_NEXTAUTH_BASE_URL: process.env.NEXT_PUBLIC_NEXTAUTH_BASE_URL,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
};

export default nextConfig;
