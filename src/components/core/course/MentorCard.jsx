'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ExternalLink } from 'lucide-react'

function getInitials(name) {
  if (!name) return 'MN'
  const words = name.trim().split(/\s+/)
  if (words.length === 1) return words[0].substring(0, 2).toUpperCase()
  return (words[0][0] + (words[1]?.[0] || '')).toUpperCase()
}

export default function MentorCard({ mentor }) {
  // Pastikan object mentor dan ID-nya ada
  if (!mentor || !mentor.id) return null

  // Ambil data user dari object mentor
  const user = mentor.user || {}
  const name = user.name || 'Unknown Mentor'
  const imageUrl = user.profile_uri

  return (
    <Link
      href={`/mentor/${mentor.id}`}
      className="group flex items-center justify-between rounded-lg border border-gray-100 p-3 transition-all hover:border-blue-200 hover:bg-blue-50/50 hover:shadow-sm"
    >
      <div className="flex items-center gap-3 overflow-hidden">
        {/* Avatar Container */}
        <div className="relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gray-100 text-gray-500 ring-2 ring-white">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={name}
              fill
              className="object-cover"
              sizes="40px"
            />
          ) : (
            <span className="text-xs font-bold">{getInitials(name)}</span>
          )}
        </div>

        {/* Nama Mentor Saja */}
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-gray-900 group-hover:text-blue-700">
            {name}
          </p>
        </div>
      </div>

      {/* Icon Arrow */}
      <ExternalLink
        size={14}
        className="shrink-0 text-gray-400 group-hover:text-blue-500"
      />
    </Link>
  )
}
