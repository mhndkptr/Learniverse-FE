'use client'

import { useState, useMemo } from 'react'
import { useGetAllCourse } from '@/hooks/course.hook'
import CourseCard from '@/components/core/course/CourseCard'

export default function CoursePage() {
  const [search, setSearch] = useState('')

  // Fetch data dari backend
  const { courses, isLoading } = useGetAllCourse({
    params: {
      // kamu bisa tambahkan pagination atau order_by bila perlu
      // limit: 50,
    },
  })

  // Loading
  if (isLoading) return <p className="mt-10 text-center">Loading...</p>

  // Filter by search
  const filteredCourses = useMemo(() => {
    if (!courses) return []
    return courses.filter((course) =>
      course.title.toLowerCase().includes(search.toLowerCase())
    )
  }, [courses, search])

  return (
    <div className="flex items-center justify-center">
      <main className="flex w-full flex-col items-center justify-between px-16 py-32">
        <h1 className="mb-8 text-center text-3xl font-bold text-gray-900">
          Our Courses
        </h1>

        {/* Search bar */}
        <div className="mb-10 flex w-full justify-center">
          <input
            type="text"
            placeholder="Search course"
            className="focus:ring-bluePrimary-500 w-full max-w-xl rounded-full border border-gray-200 bg-gray-200 px-5 py-3 text-gray-800 placeholder-gray-500 shadow-sm focus:ring-2 focus:outline-none"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Courses grid */}
        <div className="w-full grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {filteredCourses.map((course, index) => (
            <CourseCard key={index} course={course} />
          ))}
        </div>
      </main>
    </div>
  )
}
