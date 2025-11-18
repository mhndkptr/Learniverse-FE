/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,
  images: {
    domains: [
      'images.unsplash.com', // gambar dari Unsplash
      'randomuser.me', // gambar mentor dari randomuser API
      'res.cloudinary.com',
    ],
  },
}

export default nextConfig
