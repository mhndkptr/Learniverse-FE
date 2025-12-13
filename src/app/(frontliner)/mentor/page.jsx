'use client'

import { useState, useMemo } from 'react'
import MentorGrid from '@/components/core/mentor/MentorGrid'
import MentorSearch from '@/components/core/mentor/MentorSearch'
import { useGetMentors } from '@/hooks/mentor.hook'

export default function MentorPage() {
  const [params, setParams] = useState({
    pagination: { page: 1, limit: 12 },
    search: '',
    include_relation: ['user', 'course'],
    filter: {
      status: 'ACCEPTED',
    },
  })

  const { mentors, isLoading, isFetching } = useGetMentors({ params })

  // [REVISI] Logic untuk mengelompokkan mentor berdasarkan user.id
  const groupedMentors = useMemo(() => {
    if (!mentors) return []

    const map = new Map()

    mentors.forEach((record) => {
      if (!record.user) return
      const userId = record.user.id

      if (!map.has(userId)) {
        // Menggunakan USER ID sebagai ID utama untuk link/kartu
        map.set(userId, {
          id: userId, // <--- ID yang dikirim ke URL adalah USER ID
          user: record.user,
          bio: record.bio,
          courseTitles: record.course ? [record.course.title] : [],
        })
      } else {
        const existing = map.get(userId)
        if (
          record.course &&
          !existing.courseTitles.includes(record.course.title)
        ) {
          existing.courseTitles.push(record.course.title)
        }
      }
    })

    return Array.from(map.values())
  }, [mentors])

  const handleSearch = (query) => {
    setParams((prev) => ({
      ...prev,
      search: query,
      pagination: { ...prev.pagination, page: 1 },
    }))
  }

  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex w-full flex-col px-6 py-32 md:px-16">
        {/* Header Section */}
        <div className="mb-12 text-center">
          <h1 className="text-foreground mb-4 text-4xl font-bold">
            Our Mentors
          </h1>
          <p className="text-muted-foreground text-lg">
            Temukan mentor profesional untuk membimbing perjalanan belajarmu di
            Learniverse.
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-12">
          <MentorSearch onSearch={handleSearch} />
        </div>

        <MentorGrid
          mentors={groupedMentors}
          isLoading={isLoading}
          isFetching={isFetching}
        />
      </main>
    </div>
  )
}
