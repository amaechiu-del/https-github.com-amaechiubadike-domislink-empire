/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@domislink/ui', '@domislink/database', '@domislink/auth', '@domislink/payments', '@domislink/config', '@domislink/i18n', '@domislink/geolocation'],
  output: 'standalone',
}

module.exports = nextConfig