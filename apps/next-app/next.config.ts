import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  redirects: async () => {
    return [
      {
        source: `/auth/google`,
        destination: `${process.env.NEXT_PUBLIC_REDIRECT_API_URL}/auth/google`,
        permanent: false
      }
    ]
  },
  webpack: (config: {
    watchOptions: {
      poll: number
      aggregateTimeout: number
    }
  }) => {
    config.watchOptions = {
      poll: 1000,
      aggregateTimeout: 100
    }
    return config
  },
  images: {
    remotePatterns: [
      { hostname: 'randomuser.me', protocol: 'https' },
      { hostname: 'lh3.googleusercontent.com', protocol: 'https' }
    ]
  }
}

export default nextConfig
