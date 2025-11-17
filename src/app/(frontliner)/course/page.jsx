'use client'
import { useState, useEffect } from 'react'
import CourseCard from '@/components/core/course/CourseCard'

export default function CoursePage() {
  const [courses, setCourses] = useState([])
  const [search, setSearch] = useState('')

  useEffect(() => {
    // sementara dummy, nanti bisa fetch dari API
    const dummyCourses = Array(6).fill({
      title: 'Calculus',
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Tempus bibendum nisi duis mauris mauris conubia.',
      cover_uri:
        'https://images.unsplash.com/photo-1557683316-973673baf926?q=80&w=800&auto=format&fit=crop',
    })
    setCourses(dummyCourses)
  }, [])

  const filteredCourses = courses.filter((course) =>
    course.title.toLowerCase().includes(search.toLowerCase())
  )

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
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {filteredCourses.map((course, index) => (
            <CourseCard key={index} course={course} />
          ))}
        </div>
      </main>
    </div>
  )
}
