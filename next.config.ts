import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  // 强制将工作区根定位到当前项目，避免多 lockfile 造成误判
  outputFileTracingRoot: path.resolve(__dirname),
};

export default nextConfig;
