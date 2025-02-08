/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'img.sndimg.com',
        pathname: '/food/image/upload/**',
      },
    ],
  },
}

module.exports = nextConfig
