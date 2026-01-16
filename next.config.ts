import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,

  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      "rdf-canonize-native": false, 
      electron: false,              
    };
    return config;
  },
};

export default nextConfig;
