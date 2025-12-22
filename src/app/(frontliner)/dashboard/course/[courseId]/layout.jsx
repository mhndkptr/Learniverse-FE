'use client'

import { ArrowLeft } from 'lucide-react'
import CourseHeader from '@/components/core/dashboard/CourseHeader'
import CourseTabs from '@/components/core/dashboard/CourseTabs'
import { useGetCourseById } from '@/hooks/course.hook'
import { useParams, useRouter } from 'next/navigation'

const tabs = [
  {
    label: 'Overview',
    path: '',
  },
  {
    label: 'Modules',
    path: 'module',
  },
  {
    label: 'Quiz',
    path: 'quiz',
  },
  {
    label: 'Schedule',
    path: 'schedule',
  },
  {
    label: 'Participants',
    path: 'participant',
  },
]

export default function DashboardCourseLayout({ children }) {
  const router = useRouter()
  const params = useParams()
  const courseId = params.courseId
  const { course, isLoading, isPending } = useGetCourseById({
    courseId: courseId,
  })

  if (isLoading || isPending) {
    return (
      <div className="flex h-full items-center justify-center">
        <p>Loading...</p>
      </div>
    )
  }

  return (
    <div className="flex h-full">
      <main className="flex w-full flex-col px-5 py-24 md:px-16 md:py-28">
        {/* Header Navigation */}
        <div className="flex items-center justify-between border-b pb-2">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="rounded-lg p-2 transition-colors hover:bg-gray-100"
            >
              <ArrowLeft className="text-foreground h-6 w-6" />
            </button>
            <h1 className="text-foreground text-lg font-semibold">
              Course Dashboard
            </h1>
          </div>
        </div>

        {/* Course Banner */}
        <CourseHeader course={course} />

        {/* Tabs Navigation */}
        <CourseTabs tabs={tabs} courseId={courseId} />

        {/* Content Area */}
        <div className="py-8">{children}</div>
      </main>
    </div>
  )
}
