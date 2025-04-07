import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */

  env: {
    NEXTAUTH_SECRET: "dL0dhbBFKMgRWcjKIB6ud+VbO4RXkH1Pj1r8tqOSbrw=",
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
