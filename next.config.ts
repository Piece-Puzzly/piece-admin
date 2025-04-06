import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  env: {
    NEXTAUTH_SECRET: "dL0dhbBFKMgRWcjKIB6ud+VbO4RXkH1Pj1r8tqOSbrw=",
  },
};

export default nextConfig;
