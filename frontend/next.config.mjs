/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone', // Para Docker
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  experimental: {
    serverComponentsExternalPackages: ['@radix-ui/react-icons'],
  },
  env: {
    NEXT_TELEMETRY_DISABLED: '1',
    OTEL_SDK_DISABLED: 'true',
  },
};

export default nextConfig;
