/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  metadata: {
    metadataBase: new URL('http://localhost:3000'), // tymczasowo
  },
}

module.exports = nextConfig
