'use client'

import { useRouter } from 'next/navigation'
import {
  useGetCourseByIdAdmin,
  useUpdateCourseAdminMutation,
} from '@/hooks/course.hook'
import CourseForm from '@/components/core/backoffice/course/CourseForm'
import { Loader2, AlertCircle } from 'lucide-react'

export default function CourseEditPageComponent({ id }) {
  const router = useRouter()

  // 1. Fetch Data Course berdasarkan ID
  const { course, isLoading } = useGetCourseByIdAdmin({ courseId: id })

  // 2. Setup Mutation Update dengan Redirect setelah sukses
  const updateCourseMutation = useUpdateCourseAdminMutation({
    onSuccess: () => {
      router.push('/backoffice/course')
    },
  })

  // --- STATE 1: LOADING ---
  if (isLoading) {
    return (
      <div className="flex h-[50vh] w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
        <span className="ml-2 text-gray-500">Loading course data...</span>
      </div>
    )
  }

  // --- STATE 2: NOT FOUND ---
  if (!course) {
    return (
      <div className="flex h-[50vh] w-full flex-col items-center justify-center text-red-500">
        <AlertCircle size={48} className="mb-2" />
        <h2 className="text-xl font-semibold">Course Not Found</h2>
        <p className="text-gray-500">
          The course with ID <span className="font-mono text-xs">{id}</span>{' '}
          could not be found.
        </p>
        <button
          onClick={() => router.back()}
          className="mt-4 text-sm text-blue-600 underline hover:text-blue-800"
        >
          Go Back
        </button>
      </div>
    )
  }

  // --- STATE 3: READY (RENDER FORM) ---
  return (
    <div className="mx-auto max-w-7xl py-10">
      <div className="mb-8 flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Edit Course Data</h2>
      </div>

      <CourseForm
        defaultValues={course}
        mentors={[]}
        // Logika Submit: Kirim ID dan Body
        onSubmit={(values) => updateCourseMutation.mutate({ id, body: values })}
        // Loading state saat tombol Save ditekan
        isLoading={updateCourseMutation.isPending}
      />
    </div>
  )
}
