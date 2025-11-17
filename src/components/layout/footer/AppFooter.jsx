'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Instagram, Facebook, Github } from 'lucide-react'

export default function AppFooter() {
  return (
    <footer className="mt-20 w-full bg-[#0E1B50] text-white">
      {/* Upper Section */}
      <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-8 px-10 pt-12 pb-0 md:flex-row">
        {/* Left - Logo + Description */}
        <div className="flex flex-col items-start gap-6 md:w-[60%] md:flex-row md:items-center">
          {/* Logo */}
          <div className="flex flex-col items-start">
            <Image
              src="/assets/images/img-logo-learniverse.png"
              alt="Learniverse Logo"
              width={60}
              height={60}
              className="mb-2"
            />
            <h2 className="mb-2 -ml-4 text-lg font-semibold">
              Learniverse
            </h2>
          </div>

          {/* Description */}
          <p className="max-w-md text-justify text-sm leading-relaxed text-gray-200 ml-4">
            Learniverse adalah platform pembelajaran online yang menawarkan
            kursus interaktif, komunitas, dan pengalaman belajar yang
            menyenangkan untuk mendukung pengembangan diri tanpa batas.
          </p>
        </div>

        {/* Right - Links & Social */}
        <div className="flex flex-col items-start justify-between gap-10 md:mt-4 md:w-[55%] md:flex-row md:items-start ml-8">
          {/* Links */}
          <div>
            <h1 className="mb-2 text-base font-semibold">Links</h1>
            <div className="flex items-center gap-6 text-sm">
              <Link href="/" className="hover:underline">
                Home
              </Link>
              <Link href="/course" className="hover:underline">
                Our Course
              </Link>
              <Link href="/mentor" className="hover:underline">
                Become Mentor
              </Link>
            </div>
          </div>

          {/* Social Media */}
          <div>
            <h3 className="mb-3 text-base font-semibold ml">Our Social Media</h3>
            <div className="flex items-center gap-3">
              <Link
                href="https://www.instagram.com"
                target="_blank"
                className="transition hover:text-amber-400"
              >
                <Instagram size={40} />
              </Link>
              <Link
                href="https://www.facebook.com"
                target="_blank"
                className="transition hover:text-amber-400"
              >
                <Facebook size={40} />
              </Link>
              <Link
                href="https://github.com"
                target="_blank"
                className="transition hover:text-amber-400"
              >
                <Github size={40} />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="flex w-full justify-center py-4">
        <div className="w-full max-w-6xl border-t-1 border-gray-300 py-4">
          <p className="text-left text-sm text-gray-300">
            &copy; {new Date().getFullYear()} Learniverse | By Kelompok 5
          </p>
        </div>
      </div>
    </footer>
  )
}

// export default function AppFooter() {
//   return (
//     <footer className="bg-bluePrimary-500 w-full shadow-inner">
//       <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
//         <p className="text-center text-gray-500 dark:text-gray-400">
//           &copy; {new Date().getFullYear()} Learniverse. All rights reserved.
//         </p>
//       </div>
//     </footer>
//   )
// }
