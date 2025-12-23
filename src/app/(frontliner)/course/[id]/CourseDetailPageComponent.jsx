'use client'

import { useState } from 'react'
import Image from 'next/image'
import { CheckCircle2, XCircle, AlertCircle, BookOpen } from 'lucide-react'

import EnrollCourseDialog from '@/components/core/course/EnrollCourseDialog'
import MentorCard from '@/components/core/course/MentorCard'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useGetCourseById } from '@/hooks/course.hook'
import { useAuth } from '@/contexts/auth.context'
import '@/richtext.css'

export default function CourseDetailPageComponent({ id }) {
  const { user } = useAuth()
  const { course, isLoading } = useGetCourseById({ courseId: id })
  const [isEnrollDialogOpen, setIsEnrollDialogOpen] = useState(false)

  // --- LOGIC PENGECEKAN STATUS ---

  const isEnrolled = course?.course_enrollments?.some(
    (enrollment) => enrollment.user_id === user?.id
  )

  const isStudentRegistrationOpen = course?.is_open_registration_member
  const isMentorRegistrationOpen = course?.is_open_registration_mentor

  let enrollButtonText = 'Enroll Now'
  let isButtonDisabled = false
  let buttonIcon = null
  let buttonClass = 'bg-[#0E1B50] hover:bg-blue-900 text-white shadow-md'

  if (isEnrolled) {
    enrollButtonText = 'Already Enrolled'
    isButtonDisabled = true
    buttonIcon = <CheckCircle2 className="mr-2 h-5 w-5" />
    buttonClass =
      'bg-green-300 text-green-700 border border-green-200 opacity-100 hover:bg-green-100'
  } else if (!isStudentRegistrationOpen) {
    enrollButtonText = 'Registration Closed'
    isButtonDisabled = true
    buttonIcon = <XCircle className="mr-2 h-5 w-5" />
    buttonClass = 'bg-gray-100 text-gray-500 border border-gray-200'
  }

  // --- RENDER LOADING & ERROR ---

  if (isLoading)
    return (
      <div className="flex min-h-screen items-center justify-center pt-20">
        <div className="flex animate-pulse items-center gap-2 text-gray-500">
          <BookOpen className="h-5 w-5" />
          <span>Loading course details...</span>
        </div>
      </div>
    )

  if (!course || !id)
    return (
      <div className="flex min-h-screen items-center justify-center pt-20">
        <div className="text-center text-red-500">
          <AlertCircle className="mx-auto mb-2 h-10 w-10" />
          <p className="font-semibold">Course not found.</p>
        </div>
      </div>
    )

  return (
    <div className="min-h-screen w-full bg-gray-50/30 pt-28 pb-20">
      <main className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* ================= KOLOM KIRI (Konten Utama) ================= */}
          <div className="space-y-8 lg:col-span-2">
            {/* Header Course */}
            <div className="flex flex-col gap-6 md:flex-row">
              <div className="shrink-0">
                <div className="relative h-[220px] w-full overflow-hidden rounded-xl border border-gray-100 shadow-sm md:w-[350px]">
                  <Image
                    src={
                      course.cover_uri || '/assets/images/img-placeholder.png'
                    }
                    alt={course.title}
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
              <div className="flex flex-col justify-center space-y-3">
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary" className="font-mono text-xs">
                    {course.code}
                  </Badge>
                  {isEnrolled && (
                    <Badge className="border-none bg-green-600 text-white hover:bg-green-700">
                      <CheckCircle2 className="mr-1 size-3" /> Enrolled
                    </Badge>
                  )}
                </div>
                <h1 className="text-3xl leading-tight font-bold text-gray-900">
                  {course.title}
                </h1>
                <p className="leading-relaxed text-gray-600">
                  {course.description || 'No description provided.'}
                </p>
              </div>
            </div>

            {/* Syllabus */}
            <div className="rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
              <h2 className="mb-6 border-b pb-4 text-xl font-bold text-gray-900">
                Course Syllabus
              </h2>
              <div
                className="richtext leading-relaxed text-gray-700"
                dangerouslySetInnerHTML={{ __html: course.content || '' }}
              />
            </div>
          </div>

          {/* ================= KOLOM KANAN (Sidebar) ================= */}
          <div className="space-y-6">
            <div className="sticky top-28 space-y-6">
              {/* Card Pendaftaran */}
              <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                <h2 className="mb-4 text-lg font-bold text-gray-900">
                  Enrollment Status
                </h2>

                <div className="mb-6 space-y-3 rounded-lg bg-gray-50 p-4 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-600">
                      Student Registration
                    </span>
                    {isStudentRegistrationOpen ? (
                      <Badge
                        variant="outline"
                        className="border-green-200 bg-green-50 text-green-700"
                      >
                        Open
                      </Badge>
                    ) : (
                      <Badge
                        variant="outline"
                        className="border-red-200 bg-red-50 text-red-700"
                      >
                        Closed
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-600">
                      Mentor Registration
                    </span>
                    {isMentorRegistrationOpen ? (
                      <Badge
                        variant="outline"
                        className="border-green-200 bg-green-50 text-green-700"
                      >
                        Open
                      </Badge>
                    ) : (
                      <Badge
                        variant="outline"
                        className="border-red-200 bg-red-50 text-red-700"
                      >
                        Closed
                      </Badge>
                    )}
                  </div>
                </div>

                <Button
                  size="lg"
                  className={`w-full font-bold transition-all ${buttonClass}`}
                  onClick={() => setIsEnrollDialogOpen(true)}
                  disabled={isButtonDisabled}
                >
                  {buttonIcon}
                  {enrollButtonText}
                </Button>

                {isEnrolled && (
                  <div className="mt-3">
                    <Button
                      className="w-full bg-blue-900 text-white hover:bg-blue-700"
                      onClick={() =>
                        (window.location.href = `/dashboard/course/${id}`)
                      }
                    >
                      Go to Course
                    </Button>
                  </div>
                )}

                {!isButtonDisabled && (
                  <p className="mt-4 text-center text-xs text-gray-400">
                    *By enrolling, you agree to our terms & conditions.
                  </p>
                )}
              </div>

              {/* List Mentor */}
              <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                <h2 className="mb-4 text-lg font-bold text-[#0E1B50]">
                  Course Mentors
                </h2>
                <div className="space-y-4">
                  {course.mentors && course.mentors.length > 0 ? (
                    course.mentors
                      .filter((m) => m.status === 'ACCEPTED')
                      .filter((m, idx, arr) => {
                        const uid = m.user?.id
                        if (!uid) return true
                        return (
                          arr.findIndex(
                            (x) => x.user?.id === uid && x.status === 'ACCEPTED'
                          ) === idx
                        )
                      })
                      .map((mentorItem, index) => {
                        const preparedMentorData = {
                          id: mentorItem.user?.id,
                          user: {
                            name: mentorItem.user?.name,
                            profile_uri: mentorItem.user?.profile_uri,
                          },
                        }

                        return (
                          <MentorCard key={index} mentor={preparedMentorData} />
                        )
                      })
                  ) : (
                    <div className="py-8 text-center text-sm text-gray-400">
                      No mentors assigned yet.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <EnrollCourseDialog
        course={course}
        onOpenChange={setIsEnrollDialogOpen}
        open={isEnrollDialogOpen}
      />
    </div>
  )
}
