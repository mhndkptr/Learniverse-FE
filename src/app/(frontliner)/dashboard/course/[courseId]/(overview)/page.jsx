'use client'

import { useGetCourseByIdDashboard } from '@/hooks/course.hook'
import { useParams } from 'next/navigation'

export default function DashboardCoursePage() {
  const params = useParams()
  const courseId = params.courseId

  const { course, isLoading, isPending } = useGetCourseByIdDashboard({
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
      <div className="w-full space-y-6">
        {/* Headline Section */}
        <section className="pb-6">
          <div
            className="richtext leading-relaxed text-gray-700"
            dangerouslySetInnerHTML={{ __html: course?.content || '' }}
          />
        </section>
      </div>
    </div>
  )
}
