/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { 
        hostname: "images.pexels.com" 
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        port: '',
        pathname: '/dlbeorqf7/**',
      }
    ],
  },
};

export default nextConfig;
