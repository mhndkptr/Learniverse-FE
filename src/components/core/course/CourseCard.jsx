'use client'

import { ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function CourseCard({ course }) {
  return (
    <div className="overflow-hidden rounded-lg bg-white shadow-md transition-shadow duration-300 hover:shadow-xl">
      {/* Gambar */}
      <img
        src={course.cover_uri || '/default-course.jpg'}
        alt={course.title}
        className="h-40 w-full object-cover"
      />

      {/* Konten */}
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900">{course.title}</h3>
        <p className="mt-1 line-clamp-2 text-sm text-gray-600">
          {course.description || 'No description available.'}
        </p>

        {/* Tombol menuju detail */}
        <div className="mt-3">
          <Link href={`/course/${course.id || '1'}`} passHref>
            <Button
              variant="primary"
              size="default"
              className="flex items-center gap-1"
            >
              See Detail <ExternalLink size={14} />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
