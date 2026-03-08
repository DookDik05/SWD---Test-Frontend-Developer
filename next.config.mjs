/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['react-i18next', 'i18next'],
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
