/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  reactStrictMode: true,
  poweredByHeader: false,
  
  // Environment variables exposed to the browser
  env: {
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    NEXT_PUBLIC_AUTH_SERVICE_URL: process.env.NEXT_PUBLIC_AUTH_SERVICE_URL,
  },

  // Rewrites for API proxying
  async rewrites() {
    return [
      {
        source: '/api/auth/:path*',
        destination: `${process.env.AUTH_SERVICE_URL}/api/:path*`,
      },
      {
        source: '/api/payments/:path*',
        destination: `${process.env.PAYMENTS_SERVICE_URL}/api/:path*`,
      },
      {
        source: '/api/geo/:path*',
        destination: `${process.env.GEOLOCATION_SERVICE_URL}/api/:path*`,
      },
    ];
  },

  // Headers for security
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin'
          }
        ]
      }
    ];
  }
};

module.exports = nextConfig;
