'use client'
import { useRouter } from 'next/navigation'
import { useCreateCourseAdminMutation } from '@/hooks/course.hook' // Import hook yang sudah dibetulkan
import CourseForm from '@/components/core/backoffice/course/CourseForm'

export default function BackofficeCourseCreatePage() {
  const router = useRouter()

  // Panggil hook. Sekarang tidak akan error meskipun tanpa parameter.
  // Tapi sebaiknya kita kasih parameter onSuccess untuk redirect.
  const createMutation = useCreateCourseAdminMutation({
    onSuccess: () => {
      router.push('/backoffice/course') // Pindah halaman setelah sukses
    },
  })

  return (
    <div className="space-y-4">
      {/* ... Header ... */}

      <CourseForm
        mentors={[]}
        // Panggil mutate saat form disubmit
        onSubmit={(payload) => createMutation.mutate(payload)}
        // (Optional) Loading state
        isLoading={createMutation.isPending}
      />
    </div>
  )
}
