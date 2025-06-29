import type { NextConfig } from "next";
import type { Configuration } from 'webpack';

const nextConfig: NextConfig = {
  webpack: (config: Configuration, { isServer }: { isServer: boolean }) => {
    if (!isServer) {
      // Don't attempt to load these server-only modules on the client-side
      config.resolve = {
        ...config.resolve,
        fallback: {
          ...(config.resolve?.fallback || {}),
          fs: false,
          child_process: false,
          net: false,
          tls: false,
        },
      };
    }
    return config;
  },
};

export default nextConfig;
