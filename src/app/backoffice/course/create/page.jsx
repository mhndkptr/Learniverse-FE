'use client'

import { useRouter } from 'next/navigation'
import { useCreateCourseAdminMutation } from '@/hooks/course.hook'
import CourseForm from '@/components/core/backoffice/course/CourseForm'

export default function BackofficeCourseCreatePage() {
  const router = useRouter()

  // Setup Mutation Create dengan Redirect
  const createMutation = useCreateCourseAdminMutation({
    onSuccess: () => {
      router.push('/backoffice/course')
    },
  })

  return (
    <div className="mx-auto max-w-5xl py-10">
      {/* Header Halaman */}
      <div className="mb-8 flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Create New Course</h2>
      </div>

      {/* Form Component */}
      <CourseForm
        mentors={[]}
        // Handle Submit
        onSubmit={(payload) => createMutation.mutate(payload)}
        // Handle Loading:
        isLoading={createMutation.isPending}
      />
    </div>
  )
}
