'use client'

import { Button } from '@/components/ui/button'
import { useGetAllEnrolledCourse } from '@/hooks/course.hook'
import { ArrowUpRight } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function ContinueLearning() {
  const router = useRouter()
  const { enrolledCourses, isLoading, isPending } = useGetAllEnrolledCourse()

  if (isLoading || isPending) {
    return <div>Loading...</div>
  }

  return (
    <div className="rounded-lg border border-gray-200 p-6">
      <h2 className="text-foreground mb-6 flex items-center gap-2 text-xl font-bold">
        <span>📚</span> Continue Learning
      </h2>

      <div className="space-y-4">
        {enrolledCourses.map((course) => (
          <div
            key={course.id}
            className="flex gap-4 border-b border-gray-200 pb-4 last:border-b-0"
          >
            {/* Thumbnail */}
            <div className="flex-shrink-0">
              <img
                src={course.cover_uri || '/placeholder.svg'}
                alt={course.title}
                className="h-20 w-20 rounded object-cover"
              />
            </div>

            {/* Content */}
            <div className="flex-1">
              <h3 className="text-foreground mb-1 font-bold">{course.title}</h3>
              <p className="mb-3 text-sm text-gray-600">{course.description}</p>
              <Button
                onClick={() => router.push(`/dashboard/course/${course.id}`)}
                variant="secondary"
                size="sm"
              >
                Continue Learning <ArrowUpRight size={14} />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
