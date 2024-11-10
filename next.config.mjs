/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'utfs.io'
        // pathname: `/a/${process.env.NEXT_PUBLIC_UPLOADTHING_APP_ID}/*`
      },
      { protocol: 'https', hostname: 'lh3.googleusercontent.com' }
    ]
  }
}

export default nextConfig
