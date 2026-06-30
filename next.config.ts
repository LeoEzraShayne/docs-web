import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  turbopack: {
    root: path.resolve(__dirname),
  },
  async redirects() {
    return [
      {
        source: "/blog/requirements-definition-template",
        destination: "/requirements-definition-template",
        statusCode: 301,
      },
    ];
  },
};

export default nextConfig;
