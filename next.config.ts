import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
  // Vercelでの動的レンダリングを保証
  ...(process.env.VERCEL && {
    generateBuildId: async () => {
      return 'build-' + Date.now();
    },
  }),
};

export default nextConfig;
