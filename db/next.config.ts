import type { NextConfig } from "next";

const internalApi = process.env.API_INTERNAL_URL || "http://127.0.0.1:4000";

const nextConfig: NextConfig = {
  async rewrites() {
    return [{ source: "/api/:path*", destination: `${internalApi}/api/:path*` }];
  },
  async redirects() {
    return [
      { source: "/buyer/index.html", destination: "/", permanent: true },
      { source: "/staff/index.html", destination: "/staff", permanent: true },
      { source: "/admin/index.html", destination: "/admin", permanent: true },
    ];
  },
};

export default nextConfig;
