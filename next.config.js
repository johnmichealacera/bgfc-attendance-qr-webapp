/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost'],
  },
  // Prevent static generation of dynamic routes
  trailingSlash: false,
  // Ensure proper handling of dynamic content
  typescript: {
    ignoreBuildErrors: false,
  },
}

module.exports = nextConfig
