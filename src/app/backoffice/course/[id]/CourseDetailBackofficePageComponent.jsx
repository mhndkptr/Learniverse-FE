'use client'

import { useRouter } from 'next/navigation'
import { useGetCourseByIdAdmin } from '@/hooks/course.hook'
import {
  Loader2,
  AlertCircle,
  ArrowLeft,
  Pencil,
  FileText,
  Users,
  GraduationCap,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { formatCurrency, formatDate } from '@/utils/helper'
import { Badge } from '@/components/ui/badge'

export default function CourseDetailPageComponent({ id }) {
  const router = useRouter()
  const { course, isLoading } = useGetCourseByIdAdmin({ courseId: id })

  // --- LOADING STATE ---
  if (isLoading) {
    return (
      <div className="flex h-[50vh] w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
        <span className="ml-2 text-gray-500">Loading course detail...</span>
      </div>
    )
  }

  // --- NOT FOUND STATE ---
  if (!course) {
    return (
      <div className="flex h-[50vh] w-full flex-col items-center justify-center text-red-500">
        <AlertCircle size={48} className="mb-2" />
        <h2 className="text-xl font-semibold">Course Not Found</h2>
        <Button onClick={() => router.back()} variant="link" className="mt-2">
          Go Back
        </Button>
      </div>
    )
  }

  // --- CONTENT RENDER ---
  return (
    <div className="mx-auto w-full max-w-7xl space-y-6 py-10">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="size-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">{course.title}</h1>
            <p className="text-muted-foreground font-mono text-sm">
              {course.code}
            </p>
          </div>
        </div>

        <Button
          className="bg-amber-600 text-white hover:bg-amber-700"
          onClick={() => router.push(`/backoffice/course/${id}/manage`)}
        >
          <Pencil className="mr-2 size-4" /> Manage Course
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {/* KOLOM KIRI: Gambar & Status */}
        <div className="space-y-6 md:col-span-1">
          {/* Cover Image & Basic Info */}
          <div className="rounded-lg border bg-white p-4 shadow-sm">
            <div className="mb-4 aspect-video w-full overflow-hidden rounded-md bg-gray-100">
              <img
                src={
                  course.cover_uri || '/assets/images/img-image-placeholder.png'
                }
                alt={course.title}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b py-2">
                <span className="text-sm text-gray-500">Price</span>
                <span className="text-lg font-bold">
                  {formatCurrency(course.price)}
                </span>
              </div>
              <div className="flex items-center justify-between border-b py-2">
                <span className="text-sm text-gray-500">Created At</span>
                <span className="text-sm font-medium">
                  {formatDate(course.created_at)}
                </span>
              </div>
              <div className="flex items-center justify-between border-b py-2">
                <span className="text-sm text-gray-500">Last Updated</span>
                <span className="text-sm font-medium">
                  {formatDate(course.updated_at)}
                </span>
              </div>
            </div>
          </div>

          {/* Registration Status */}
          <div className="rounded-lg border bg-white p-4 shadow-sm">
            <h3 className="mb-4 font-semibold">Registration Status</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">For Member</span>
                {course.is_open_registration_member ? (
                  <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                    Open
                  </Badge>
                ) : (
                  <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
                    Closed
                  </Badge>
                )}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">For Mentor</span>
                {course.is_open_registration_mentor ? (
                  <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                    Open
                  </Badge>
                ) : (
                  <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
                    Closed
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* KOLOM KANAN: Detail Konten & Statistik */}
        <div className="space-y-6 md:col-span-2">
          {/* Description */}
          <div className="rounded-lg border bg-white p-6 shadow-sm">
            <h3 className="mb-3 flex items-center gap-2 font-semibold">
              <FileText className="size-4 text-gray-500" /> Short Description
            </h3>
            <p className="text-sm leading-relaxed text-gray-600">
              {course.description || 'No description provided.'}
            </p>
          </div>

          {/* Content / Syllabus */}
          <div className="rounded-lg border bg-white p-6 shadow-sm">
            <h3 className="mb-3 flex items-center gap-2 font-semibold">
              <FileText className="size-4 text-gray-500" /> Syllabus / Full
              Content
            </h3>
            <div className="prose prose-sm max-w-none rounded-md border bg-gray-50 p-4 text-gray-600">
              <pre className="font-sans whitespace-pre-wrap">
                {course.content}
              </pre>
            </div>
          </div>

          {/* Statistik dengan Tombol View */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col justify-between rounded-lg border bg-white p-4 shadow-sm">
              <div className="mb-4 text-center">
                <span className="mb-1 block text-3xl font-bold text-[#0E1B50]">
                  {course.course_enrollments?.length || 0}
                </span>
                <span className="text-muted-foreground flex items-center justify-center gap-1 text-xs font-medium">
                  <Users className="size-3" /> Students Enrolled
                </span>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="w-full text-xs"
                onClick={() =>
                  router.push(`/backoffice/enrollment?course_id=${id}`)
                }
              >
                View Students
              </Button>
            </div>

            <div className="flex flex-col justify-between rounded-lg border bg-white p-4 shadow-sm">
              <div className="mb-4 text-center">
                <span className="mb-1 block text-3xl font-bold text-[#0E1B50]">
                  {course.mentors?.length || 0}
                </span>
                <span className="text-muted-foreground flex items-center justify-center gap-1 text-xs font-medium">
                  <GraduationCap className="size-3" /> Mentors Assigned
                </span>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="w-full text-xs"
                onClick={() =>
                  router.push(`/backoffice/mentor?course_id=${id}`)
                }
              >
                View Mentors
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
