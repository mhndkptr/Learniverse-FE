'use client'

import { useRouter } from 'next/navigation'
import CourseForm from '@/components/core/backoffice/course/CourseForm'
import ConfirmDialogDelete from '@/components/core/backoffice/course/ConfirmDialogDelete'
import {
  useUpdateCourseAdminMutation,
  useDeleteCourseAdminMutation,
} from '@/hooks/course.hook'
import { useCourseManage } from '../_components/course-manage.context'
import { useState } from 'react'

export default function BackofficeCourseManageGeneralPage() {
  const router = useRouter()
  const { course, courseId, refetch } = useCourseManage()
  const [isDeleteCourseDialogOpen, setIsDeleteCourseDialogOpen] =
    useState(false)

  if (!course) return null

  const updateCourseMutation = useUpdateCourseAdminMutation({
    onSuccess: () => refetch(),
  })

  const { mutate: deleteCourse, isPending: isDeletingCourse } =
    useDeleteCourseAdminMutation({
      onSuccess: () => {
        router.push('/backoffice/course')
      },
    })

  const handleTriggerDeleteCourse = () => {
    setIsDeleteCourseDialogOpen(true)
  }

  const handleConfirmDeleteCourse = () => {
    deleteCourse(courseId)
  }

  return (
    <>
      <CourseForm
        defaultValues={course}
        onSubmit={(values) =>
          updateCourseMutation.mutate({ id: courseId, body: values })
        }
        isLoading={updateCourseMutation.isPending}
        onDelete={handleTriggerDeleteCourse}
      />

      <ConfirmDialogDelete
        isOpen={isDeleteCourseDialogOpen}
        onClose={() => setIsDeleteCourseDialogOpen(false)}
        onConfirm={handleConfirmDeleteCourse}
        title="Delete Entire Course"
        description="Are you sure you want to delete this course permanently? All modules, quizzes, and enrollments will be affected."
        isLoading={isDeletingCourse}
        confirmText="Delete Course"
        variant="danger"
      />
    </>
  )
}
