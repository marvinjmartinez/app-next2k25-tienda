import type {NextConfig} from 'next';
require('dotenv').config({ path: require('path').resolve(process.cwd(), '.env') });

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
    ],
  },
  env: {
    GOOGLE_API_KEY: process.env.GOOGLE_API_KEY,
  },
};

export default nextConfig;
