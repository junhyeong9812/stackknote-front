import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Docker에서 standalone 모드로 빌드하기 위한 설정
  output: 'standalone',
  
  // 이미지 최적화 (선택사항)
  images: {
    unoptimized: true
  }
};

export default nextConfig;