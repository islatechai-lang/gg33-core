import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: [],
  webpack: (config, { isServer }) => {
    config.resolve.alias['wouter'] = path.resolve(__dirname, 'client/src/lib/wouter-next.tsx');
    config.resolve.alias['@'] = path.resolve(__dirname, 'client/src');
    config.resolve.alias['@shared'] = path.resolve(__dirname, 'shared');
    config.resolve.alias['@assets'] = path.resolve(__dirname, 'attached_assets');

    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: false,
      };
    }
    return config;
  },
};

export default nextConfig;
