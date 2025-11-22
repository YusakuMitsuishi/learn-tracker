import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Supabaseを使用する動的アプリケーションのため、静的エクスポートを無効化
  output: undefined,
};

export default nextConfig;
