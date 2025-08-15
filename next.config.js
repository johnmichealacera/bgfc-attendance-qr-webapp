/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  images: {
    domains: ['localhost'],
  },
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
  // Prevent static generation of dynamic routes
  trailingSlash: false,
  // Ensure proper handling of dynamic content
  typescript: {
    ignoreBuildErrors: false,
  },
}

module.exports = nextConfig
