import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  redirects: async () => {
    return [
      {
        source: `/auth/google`,
        destination: `${process.env.NEXT_PUBLIC_API_URL}/auth/google`,
        permanent: false
      }
    ]
  }
}

export default nextConfig
