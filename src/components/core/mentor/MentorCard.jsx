'use client'

import { ArrowRight } from 'lucide-react'
import Image from 'next/image'

export default function MentorCard({ mentor }) {
  return (
    <div className="border-border bg-card flex flex-col rounded-2xl border p-6 transition-shadow duration-300 hover:shadow-lg">
      {/* Mentor Image */}
      <div className="mb-4 flex justify-center">
        <div className="bg-muted relative h-20 w-20 overflow-hidden rounded-full">
          <Image
            src={mentor.image || '/placeholder.svg'}
            alt={mentor.name}
            fill
            className="object-cover"
          />
        </div>
      </div>

      {/* Mentor Name */}
      <h3 className="text-foreground mb-3 text-center text-lg font-semibold">
        {mentor.name}
      </h3>

      {/* Mentor Description */}
      <p className="text-muted-foreground mb-4 line-clamp-3 flex-grow text-center text-sm">
        {mentor.description}
      </p>

      {/* See Detail Button */}
      <button className="flex w-full items-center justify-center gap-2 rounded-lg bg-amber-700 px-4 py-2 font-medium text-white transition-colors duration-200 hover:bg-amber-800">
        <span>See Detail</span>
        <ArrowRight className="h-4 w-4" />
      </button>
    </div>
  )
}
