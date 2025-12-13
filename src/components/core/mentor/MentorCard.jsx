'use client'

import { ArrowRight } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

// Helper function untuk inisial nama
function getInitials(name) {
  if (!name) return 'MN'
  const words = name.trim().split(/\s+/)
  if (words.length === 1) return words[0].substring(0, 2).toUpperCase()
  return (words[0][0] + (words[1]?.[0] || '')).toUpperCase()
}

export default function MentorCard({ mentor }) {
  // Pastikan courseTitles selalu array
  const { courseTitles = [] } = mentor

  return (
    <div className="group flex flex-col rounded-2xl border border-gray-200 bg-white p-6 transition-all duration-300 hover:border-blue-200 hover:shadow-lg">
      {/* Mentor Image / Avatar */}
      <div className="mb-4 flex justify-center">
        <div className="relative flex h-20 w-20 items-center justify-center overflow-hidden rounded-full bg-gray-100 ring-2 ring-transparent transition-all group-hover:ring-blue-100">
          {mentor.image || mentor.profile_uri ? (
            <Image
              src={mentor.image || mentor.profile_uri}
              alt={mentor.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            /* Tampilkan Inisial jika tidak ada gambar */
            <span className="text-xl font-bold text-gray-500">
              {getInitials(mentor.name)}
            </span>
          )}
        </div>
      </div>

      {/* Mentor Name */}
      <h3 className="mb-1 line-clamp-1 text-center text-lg font-bold text-gray-900">
        {mentor.name}
      </h3>

      {/* Menampilkan list kursus */}
      <p className="mb-3 text-center text-xs tracking-wider text-gray-500 uppercase">
        Mentor for:
      </p>

      <div className="mb-6 h-12 w-full">
        {courseTitles.length > 0 ? (
          <div className="flex h-full flex-wrap content-start justify-center gap-1.5 overflow-hidden align-top">
            {courseTitles.slice(0, 3).map((title, index) => (
              <span
                key={index}
                className="inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-[10px] font-medium text-yellow-800"
              >
                {title}
              </span>
            ))}
            {courseTitles.length > 3 && (
              <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-medium text-gray-600">
                +{courseTitles.length - 3} more
              </span>
            )}
          </div>
        ) : (
          <div className="flex h-full items-center justify-center">
            <span className="text-sm text-gray-400 italic">
              - General Mentor -
            </span>
          </div>
        )}
      </div>

      {/* See Detail Button */}
      {/* BENAR: Link mengarah ke URL dinamis /mentor/[id] 
          Next.js akan merender src/app/(frontliner)/mentor/[id]/page.jsx
      */}
      <Link
        href={`/mentor/${mentor.id}`}
        className="mt-auto flex w-full items-center justify-center gap-2 rounded-lg bg-[#0E1B50] px-4 py-2.5 text-sm font-medium text-white transition-colors duration-200 hover:bg-blue-800 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
      >
        <span>See Detail</span>
        <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  )
}
