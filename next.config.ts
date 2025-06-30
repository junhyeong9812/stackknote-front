import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Docker에서 standalone 모드로 빌드하기 위한 설정
  output: 'standalone',
  basePath: '/stacknote',
    assetPrefix: '/stacknote',
  
  // 이미지 최적화 (선택사항)
  images: {
    unoptimized: true
  },
  eslint: {
    ignoreDuringBuilds: true, // 빌드 시 ESLint 워닝/에러 무시
  },
};

export default nextConfig;