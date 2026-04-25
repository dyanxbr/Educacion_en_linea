/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',  // ← IMPORTANTE para Railway
  swcMinify: true,
}

module.exports = nextConfig