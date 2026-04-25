/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable standalone output for optimized deployments
  output: process.env.VERCEL ? 'standalone' : 'export',
  trailingSlash: true,
  images: {
    unoptimized: true,
    domains: ['supabase.co', 'cloudflare.com']
  },
  // Enable experimental features for better performance
  experimental: {
    optimizeCss: true,
  },
  // Optimize for production
  swcMinify: true,
  compress: true,
  poweredByHeader: false,
  // API rewrites to gateway
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: process.env.NEXT_PUBLIC_API_GATEWAY_URL 
          ? `${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/api/:path*`
          : '/api/:path*',
      },
    ]
  },
}

module.exports = nextConfig