/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  experimental: {
    allowedDevOrigins: ["*"],
  },
  env: {
    GOOGLE_API_KEY: process.env.GOOGLE_API_KEY,
    // El nombre del bucket se define aquí para que esté disponible en toda la app.
    FIREBASE_STORAGE_BUCKET: "distrimnin-tienda.firebasestorage.app",
  },
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
      {
        protocol: 'https',
        hostname: 'storage.googleapis.com',
        port: '',
        pathname: '/**',
      }
    ],
  },
};

module.exports = nextConfig;
