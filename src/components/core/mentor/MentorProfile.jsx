'use client'

import Image from 'next/image'
import { Badge } from '@/components/ui/badge'
import { Briefcase, Quote, User } from 'lucide-react'

// Helper Inisial
function getInitials(name) {
  if (!name) return 'MN'
  const words = name.trim().split(/\s+/)
  if (words.length === 1) return words[0].substring(0, 2).toUpperCase()
  return (words[0][0] + (words[1]?.[0] || '')).toUpperCase()
}

export default function MentorProfile({ mentor }) {
  if (!mentor) return null

  // Safely access data (cegah error jika user null)
  const user = mentor.user || {}
  const name = user.name || 'Nama Tidak Tersedia'
  const imageUrl = user.profile_uri
  const bio = mentor.bio || 'Belum ada bio yang ditambahkan.'
  const motivation = mentor.motivation
  const courseTitle = mentor.course?.title || 'General Mentor'

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
      {/* Header Background (Opsional) */}
      <div className="h-32 w-full bg-gradient-to-r from-[#0E1B50] to-blue-900"></div>

      <div className="relative px-8 pb-8">
        {/* Avatar Profile - Posisi naik ke atas header */}
        <div className="-mt-16 mb-6 flex justify-center sm:justify-start">
          <div className="relative h-32 w-32 overflow-hidden rounded-full border-4 border-white bg-white shadow-md">
            {imageUrl ? (
              <Image
                src={imageUrl}
                alt={name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 33vw"
                priority
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-slate-100 text-3xl font-bold text-slate-400">
                {getInitials(name)}
              </div>
            )}
          </div>
        </div>

        {/* Info Utama */}
        <div className="text-center sm:text-left">
          <h1 className="text-2xl font-bold text-gray-900">{name}</h1>
          <div className="mt-2 flex flex-wrap justify-center gap-2 sm:justify-start">
            <Badge
              variant="secondary"
              className="bg-blue-50 text-blue-700 hover:bg-blue-100"
            >
              <Briefcase className="mr-1 h-3 w-3" />
              Mentor: {courseTitle}
            </Badge>
            <Badge variant="outline" className="text-gray-500">
              {mentor.status || 'Active'}
            </Badge>
          </div>
        </div>

        {/* Detail Content */}
        <div className="mt-8 grid gap-8 border-t border-gray-100 pt-8 sm:grid-cols-1">
          {/* Bio Section */}
          <div className="space-y-3">
            <h3 className="flex items-center text-lg font-semibold text-gray-900">
              <User className="mr-2 h-5 w-5 text-blue-600" />
              About Me
            </h3>
            <p className="leading-relaxed whitespace-pre-wrap text-gray-600">
              {bio}
            </p>
          </div>

          {/* Motivation Section (Jika ada) */}
          {motivation && (
            <div className="space-y-3 rounded-lg bg-gray-50 p-6">
              <h3 className="flex items-center text-lg font-semibold text-gray-900">
                <Quote className="mr-2 h-5 w-5 text-blue-600" />
                Motivation
              </h3>
              <p className="text-gray-600 italic">"{motivation}"</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
