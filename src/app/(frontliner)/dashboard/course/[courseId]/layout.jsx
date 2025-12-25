'use client'

import { ArrowLeft, Settings } from 'lucide-react'
import CourseHeader from '@/components/core/dashboard/CourseHeader'
import CourseTabs from '@/components/core/dashboard/CourseTabs'
import { useGetCourseByIdDashboard } from '@/hooks/course.hook'
import { useParams, useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/auth.context'
import { Button } from '@/components/ui/button'

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
  const { user, isAuthLoading } = useAuth()
  const { course, isLoading, isPending } = useGetCourseByIdDashboard({
    courseId: courseId,
  })

  if (isLoading || isPending || isAuthLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <p>Loading...</p>
      </div>
    )
  }

  const isEnrolled = course?.course_enrollments?.some(
    (enrollment) => enrollment.user_id === user?.id
  )
  const isMentor = course?.mentors?.some(
    (mentor) =>
      (mentor.user?.id === user?.id || mentor.user_id === user?.id) &&
      mentor.status === 'ACCEPTED'
  )
  const canAccess = user?.role === 'ADMIN' || Boolean(isEnrolled || isMentor)
  const canManage = user?.role === 'ADMIN' || Boolean(isMentor)

  if (!canAccess) {
    return (
      <div className="flex h-full items-center justify-center px-6 py-24">
        <div className="w-full max-w-lg rounded-xl border border-gray-200 bg-white p-8 text-center shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">Akses ditolak</h2>
          <p className="mt-2 text-sm text-gray-600">
            Anda hanya bisa mengakses dashboard course jika sudah terdaftar pada
            course ini.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Button variant="outline" onClick={() => router.back()}>
              Kembali
            </Button>
            <Button
              className="bg-[#0E1B50] text-white hover:bg-blue-900"
              onClick={() => (window.location.href = '/course')}
            >
              Lihat Course Lainnya
            </Button>
          </div>
        </div>
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
        <div className="flex items-center justify-between gap-4">
          <CourseTabs tabs={tabs} courseId={courseId} />
          {canManage && (
            <Button
              className="bg-[#0E1B50] text-white hover:bg-blue-900"
              onClick={() =>
                router.push(`/backoffice/course/${courseId}/manage`)
              }
            >
              <Settings className="mr-2 size-4" />
              Manage This Course
            </Button>
          )}
        </div>

        {/* Content Area */}
        <div className="py-4 md:py-6">{children}</div>
      </main>
    </div>
  )
}
