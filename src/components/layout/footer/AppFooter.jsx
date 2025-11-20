'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Instagram, Facebook, Github } from 'lucide-react'

export default function AppFooter() {
  return (
    <footer className="bg-bluePrimary-500 w-full text-white">
      {/* Upper Section */}
      <div className="mx-auto flex flex-col items-start justify-between gap-4 px-5 pt-12 pb-0 md:flex-row md:gap-8 md:px-16">
        {/* Left - Logo + Description */}
        <div className="flex flex-col items-start gap-4 md:w-[60%] md:flex-row md:items-center md:gap-6">
          {/* Logo */}
          <div className="flex flex-col items-start">
            <Image
              src="/assets/images/img-logo-learniverse.png"
              alt="Learniverse Logo"
              width={60}
              height={60}
              className="mb-2"
            />
            <h2 className="mb-2 text-lg font-semibold">Learniverse</h2>
          </div>

          {/* Description */}
          <p className="max-w-md text-justify text-sm leading-relaxed text-gray-200 md:ml-4">
            Learniverse adalah platform pembelajaran online yang menawarkan
            kursus interaktif, komunitas, dan pengalaman belajar yang
            menyenangkan untuk mendukung pengembangan diri tanpa batas.
          </p>
        </div>

        {/* Right - Links & Social */}
        <div className="flex flex-col items-start justify-between gap-6 md:mt-4 md:ml-8 md:w-[55%] md:flex-row md:items-start md:gap-8">
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
              <Link href="/mentor/registration" className="hover:underline">
                Become Mentor
              </Link>
            </div>
          </div>

          {/* Social Media */}
          <div>
            <h3 className="ml mb-3 text-base font-semibold">
              Our Social Media
            </h3>
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
        <div className="mx-5 w-full border-t border-gray-300 py-4 md:mx-16">
          <p className="text-left text-sm text-gray-300">
            &copy; 2025 Learniverse | By Kelompok 5
          </p>
        </div>
      </div>
    </footer>
  )
}
