'use client'

import Image from 'next/image'
import { ExternalLink } from 'lucide-react'

export default function MentorCard({ mentor }) {
  return (
    <div className="flex items-center justify-between rounded-lg border p-3 transition hover:shadow-sm">
      <div className="flex items-center gap-3">
        <Image
          src={mentor.photo}
          alt={mentor.name}
          width={40}
          height={40}
          className="rounded-full object-cover"
        />
        <div>
          <p className="font-medium text-gray-900">{mentor.name}</p>
          <p className="text-sm text-gray-600">{mentor.expertise}</p>
        </div>
      </div>
      <ExternalLink size={16} className="text-gray-600" />
    </div>
  )
}
