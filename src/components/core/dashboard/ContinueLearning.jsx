'use client'

import { Button } from '@/components/ui/button'
import { useGetAllEnrolledCourse } from '@/hooks/course.hook'
import { ArrowUpRight } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/auth.context'

export default function ContinueLearning() {
  const router = useRouter()
  const { user } = useAuth()
  const { enrolledCourses, isLoading, isPending } = useGetAllEnrolledCourse({
    userId: user?.id,
  })

  if (isLoading || isPending) {
    return <div>Loading...</div>
  }

  const isMentorCourse = (course) =>
    course?.course_enrollments?.some(
      (enrollment) =>
        (enrollment.user_id === user?.id || enrollment.user?.id === user?.id) &&
        enrollment.role === 'MENTOR'
    )

  const mentorCourses = enrolledCourses.filter(isMentorCourse)
  const studentCourses = enrolledCourses.filter(
    (course) => !isMentorCourse(course)
  )

  const renderCourseList = (courses, actionLabel) =>
    courses.map((course) => (
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
          <Link href={`/dashboard/course/${course.id}`}>
            <Button variant="secondary" size="sm">
              {actionLabel} <ArrowUpRight size={14} />
            </Button>
          </Link>
        </div>
      </div>
    ))

  return (
    <div className="space-y-6">
      {mentorCourses.length > 0 && (
        <div className="rounded-lg border border-gray-200 p-6">
          <div className="space-y-4">
            <h2 className="text-foreground text-lg font-bold">
              Continue Teaching
            </h2>
            <div className="space-y-4">
              {renderCourseList(mentorCourses, 'Continue Teaching')}
            </div>
          </div>
        </div>
      )}

      <div className="rounded-lg border border-gray-200 p-6">
        <div className="space-y-4">
          <h2 className="text-foreground text-lg font-bold">
            Continue Learning
          </h2>
          {studentCourses.length > 0 ? (
            <div className="space-y-4">
              {renderCourseList(studentCourses, 'Continue Learning')}
            </div>
          ) : (
            <p className="text-sm text-gray-500">Tidak ada course.</p>
          )}
        </div>
      </div>
    </div>
  )
}
