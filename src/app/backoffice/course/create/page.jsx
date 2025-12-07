'use client'

import { useRouter } from 'next/navigation'
import { useCreateCourseAdminMutation } from '@/hooks/course.hook'
import CourseForm from '@/components/core/backoffice/course/CourseForm'

export default function BackofficeCourseCreatePage() {
  const router = useRouter()

  const createMutation = useCreateCourseAdminMutation({
    onSuccess: () => {
      router.push('/backoffice/course')
    },
  })

  return (
    <div className="mx-auto max-w-7xl py-10">
      <div className="mb-8 flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Create New Course</h2>
      </div>

      <CourseForm
        mentors={[]}
        onSubmit={(payload) => createMutation.mutate(payload)}
        isLoading={createMutation.isPending}
      />
    </div>
  )
}
