'use client'

import EnrollCourseDialog from '@/components/core/course/EnrollCourseDialog'
import MentorCard from '@/components/core/course/MentorCard'
import { useGetCourseById } from '@/hooks/course.hook'
import Image from 'next/image'

export default function CourseDetailPage({ id }) {
  const { course, isLoading } = useGetCourseById({ courseId: id })
  console.log(course)
  // Loading state

  if (isLoading)
    return (
      <div className="flex items-center justify-center">
        <main className="flex w-full flex-col items-center justify-between px-16 py-32">
          <p>Loading...</p>
        </main>
      </div>
    )

  if (!course)
    return (
      <div className="flex items-center justify-center">
        <main className="flex w-full flex-col items-center justify-between px-16 py-32">
          <p>Course not found.</p>
        </main>
      </div>
    )

  return (
    <div className="flex items-center justify-center">
      <main className="flex w-full flex-col items-center justify-between px-16 py-32">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Left: Cover + Description */}
          <div className="space-y-6 lg:col-span-2">
            <div className="flex flex-col gap-6 md:flex-row">
              <Image
                src={course.cover_uri}
                alt={course.title}
                width={350}
                height={200}
                className="h-[220px] w-full rounded-lg object-cover md:w-[350px]"
              />
              <div>
                <h1 className="mb-3 text-3xl font-bold text-gray-900">
                  {course.title}
                </h1>
                <p className="text-gray-700">{course.description}</p>
              </div>
            </div>

            {/* Benefits */}
            <div className="rounded-lg border bg-white p-6 shadow-sm">
              {course.content}
            </div>
          </div>

          {/* Right: Sidebar */}
          <div className="space-y-6">
            {/* Enroll */}
            <div className="rounded-lg border bg-white p-6 shadow-sm">
              <h2 className="mb-3 text-lg font-semibold text-gray-900">
                Enroll In This Course
              </h2>

              {/*  Gunakan Dialog Enroll */}
              <EnrollCourseDialog course={course} />

              <p className="mt-3 text-xs text-gray-500">
                By enrolling in this course, you agree to our terms and
                conditions.
              </p>
            </div>

            {/* Mentor */}
            <div className="rounded-lg border bg-white p-6 shadow-sm">
              <h2 className="mb-3 text-lg font-semibold text-blue-950">
                Mentor in this course
              </h2>
              <div className="space-y-3">
                {course.mentors.map((mentor, index) => (
                  <MentorCard key={index} mentor={mentor} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
