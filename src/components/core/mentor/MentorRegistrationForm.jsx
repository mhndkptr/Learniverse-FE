'use client'

import { useState, useMemo } from 'react'
import { useRegisterMentor } from '@/hooks/mentor.hook'
import { useGetAllMentorAdmin } from '@/hooks/mentor.hook'
import { useGetAllCourse } from '@/hooks/course.hook'
import { useAuth } from '@/contexts/auth.context'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'

export default function MentorRegistrationForm() {
  const { user } = useAuth()
  const router = useRouter()

  // Ambil data kursus
  const { courses } = useGetAllCourse({
    params: { pagination: { limit: 100 } },
  })

  const [formData, setFormData] = useState({
    bio: '',
    reason: '',
    motivation: '',
    cvUrl: '',
    portfolioUrl: '',
    courseId: '',
  })

  // Logic ketat untuk menentukan apakah form valid
  const isFormInvalid = useMemo(() => {
    // 1. Cek minimal panjang karakter (Min 10 sesuai skema backend)
    const minLengthCheck =
      formData.bio.trim().length < 10 ||
      formData.reason.trim().length < 10 ||
      formData.motivation.trim().length < 10

    if (minLengthCheck) return true

    // 2. Cek kelengkapan ID dan field wajib
    if (!formData.courseId || !formData.cvUrl || !formData.portfolioUrl)
      return true

    // 3. Cek format URL (Wajib dimulai dengan http/https untuk lolos Joi .uri())
    const invalidUrl =
      !formData.cvUrl.trim().startsWith('http') ||
      !formData.portfolioUrl.trim().startsWith('http')

    if (invalidUrl) return true

    return false
  }, [formData])

  // Hook mutation
  const registerMutation = useRegisterMentor(() => {
    // Reset form on success
    setFormData({
      bio: '',
      reason: '',
      motivation: '',
      cvUrl: '',
      portfolioUrl: '',
      courseId: '',
    })
    toast.success('Pendaftaran berhasil diajukan! Menunggu review admin.')
    router.push('/my/history/mentor')
  })

  // Ambil daftar aplikasi mentor yang pernah dibuat oleh user ini
  const { mentors: myMentorApplications, isLoading: isLoadingMentorApps } =
    useGetAllMentorAdmin({
      params: {
        filter: { user_id: user?.id },
        get_all: true,
      },
    })

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!user?.id) {
      toast.error('Error: User ID not found. Please log in again.')
      return
    }

    if (isLoadingMentorApps) {
      toast.error('Loading registration history, please try again shortly.')
      return
    }

    const alreadyAppliedSameCourse = myMentorApplications.some(
      (m) => m.course_id === formData.courseId && m.status !== 'REJECTED' // boleh daftar lagi jika sebelumnya ditolak
    )

    if (alreadyAppliedSameCourse) {
      toast.error(
        'You have already applied or are awaiting review for this course.'
      )
      return
    }

    if (isFormInvalid) {
      toast.error(
        'Failed: Please complete all fields. Ensure text is at least 10 characters and URLs are valid (starting with http/https).'
      )
      return
    }

    // START REVISI KRITIS: Mengubah nama field ke snake_case
    const payload = {
      bio: formData.bio.trim(),
      reason: formData.reason.trim(),
      motivation: formData.motivation.trim(),

      // FIX: Mengganti camelCase ke snake_case sesuai backend
      cv_uri: formData.cvUrl.trim(),
      portfolio_uri: formData.portfolioUrl.trim(),

      user_id: user.id, // ID User yang terautentikasi
      course_id: formData.courseId,
    }
    // END REVISI KRITIS

    registerMutation.mutate({ payload })
  }

  return (
    <div className="w-full rounded-lg border border-gray-200 bg-white p-8 shadow-sm">
      <h1 className="text-foreground mb-8 text-center text-3xl font-bold">
        Mentor Registration Form
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Course Selection */}
        <div>
          <label
            htmlFor="courseId"
            className="text-foreground mb-2 block text-sm font-medium"
          >
            Select Course to Mentor <span className="text-red-500">*</span>
          </label>
          <select
            id="courseId"
            name="courseId"
            value={formData.courseId}
            onChange={handleInputChange}
            className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:bg-gray-50"
            required
            disabled={registerMutation.isPending}
          >
            <option value="" disabled>
              -- Select a Course --
            </option>
            {courses.map((course) => (
              <option key={course.id} value={course.id}>
                {course.title} ({course.code})
              </option>
            ))}
          </select>
        </div>

        {/* Bio Field */}
        <div>
          <label
            htmlFor="bio"
            className="text-foreground mb-2 block text-sm font-medium"
          >
            Bio <span className="text-red-500">*</span>
          </label>
          <textarea
            id="bio"
            name="bio"
            value={formData.bio}
            onChange={handleInputChange}
            placeholder="Tell us briefly about yourself (min 10 characters)..."
            className="w-full resize-none rounded-lg border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:bg-gray-50"
            rows={3}
            required
            minLength={10}
            maxLength={1000}
            disabled={registerMutation.isPending}
          />
          {formData.bio.trim().length > 0 &&
            formData.bio.trim().length < 10 && (
              <p className="mt-1 text-xs text-red-500">Minimal 10 karakter.</p>
            )}
        </div>

        {/* Reason Field */}
        <div>
          <label
            htmlFor="reason"
            className="text-foreground mb-2 block text-sm font-medium"
          >
            Reason <span className="text-red-500">*</span>
          </label>
          <textarea
            id="reason"
            name="reason"
            value={formData.reason}
            onChange={handleInputChange}
            placeholder="Why do you want to be a mentor? (min 10 characters)"
            className="w-full resize-none rounded-lg border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:bg-gray-50"
            rows={3}
            required
            minLength={10}
            maxLength={1000}
            disabled={registerMutation.isPending}
          />
          {formData.reason.trim().length > 0 &&
            formData.reason.trim().length < 10 && (
              <p className="mt-1 text-xs text-red-500">Minimal 10 karakter.</p>
            )}
        </div>

        {/* Motivation Field */}
        <div>
          <label
            htmlFor="motivation"
            className="text-foreground mb-2 block text-sm font-medium"
          >
            Motivation <span className="text-red-500">*</span>
          </label>
          <textarea
            id="motivation"
            name="motivation"
            value={formData.motivation}
            onChange={handleInputChange}
            placeholder="What is your motivation? (min 10 characters)"
            className="w-full resize-none rounded-lg border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:bg-gray-50"
            rows={3}
            required
            minLength={10}
            maxLength={1000}
            disabled={registerMutation.isPending}
          />
          {formData.motivation.trim().length > 0 &&
            formData.motivation.trim().length < 10 && (
              <p className="mt-1 text-xs text-red-500">Minimal 10 karakter.</p>
            )}
        </div>

        {/* CV Url Field */}
        <div>
          <label
            htmlFor="cvUrl"
            className="text-foreground mb-2 block text-sm font-medium"
          >
            CV URL (Google Drive/Link) <span className="text-red-500">*</span>
          </label>
          <input
            type="url"
            id="cvUrl"
            name="cvUrl"
            value={formData.cvUrl}
            onChange={handleInputChange}
            placeholder="Wajib dimulai dengan https:// atau http://"
            className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:bg-gray-50"
            required
            disabled={registerMutation.isPending}
          />
          {formData.cvUrl.trim().length > 0 &&
            !formData.cvUrl.trim().startsWith('http') && (
              <p className="mt-1 text-xs text-red-500">
                Format URL harus valid (diawali http:// atau https://).
              </p>
            )}
        </div>

        {/* Portfolio Url Field */}
        <div>
          <label
            htmlFor="portfolioUrl"
            className="text-foreground mb-2 block text-sm font-medium"
          >
            Portfolio URL <span className="text-red-500">*</span>
          </label>
          <input
            type="url"
            id="portfolioUrl"
            name="portfolioUrl"
            value={formData.portfolioUrl}
            onChange={handleInputChange}
            placeholder="Wajib dimulai dengan https:// atau http://"
            className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:bg-gray-50"
            required
            disabled={registerMutation.isPending}
          />
          {formData.portfolioUrl.trim().length > 0 &&
            !formData.portfolioUrl.trim().startsWith('http') && (
              <p className="mt-1 text-xs text-red-500">
                Format URL harus valid (diawali http:// atau https://).
              </p>
            )}
        </div>

        {/* Register Button */}
        <button
          type="submit"
          disabled={registerMutation.isPending || isFormInvalid}
          className="w-full rounded-lg bg-blue-900 px-4 py-3 font-semibold text-white transition-colors duration-200 hover:bg-blue-800 disabled:bg-gray-400"
        >
          {registerMutation.isPending ? (
            <div className="flex items-center justify-center gap-2">
              <Loader2 className="size-4 animate-spin" /> Submitting...
            </div>
          ) : (
            'Register as Mentor'
          )}
        </button>
      </form>
    </div>
  )
}
