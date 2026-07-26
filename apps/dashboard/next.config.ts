import { loadEnvConfig } from "@next/env";
import type { NextConfig } from "next";
import path from "node:path";

// next dev/start cwd is apps/dashboard; also try __dirname for config location
const fromCwd = path.resolve(process.cwd(), "../..");
const fromConfig = path.resolve(__dirname, "../..");
loadEnvConfig(fromCwd);
loadEnvConfig(fromConfig);
loadEnvConfig(process.cwd());

const nextConfig: NextConfig = {};

export default nextConfig;
