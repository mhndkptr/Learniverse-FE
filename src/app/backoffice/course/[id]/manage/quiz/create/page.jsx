'use client'

import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useBackofficeBreadcrumb } from '@/contexts/backoffice-breadcrumb.context'
import { useAddQuizMutation } from '@/hooks/quiz.hook'
import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowLeft } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import z from 'zod'

// 1. Definisikan Schema sesuai struktur JSON yang diinginkan
const quizFormSchema = z.object({
  title: z.string().min(1, { message: 'Title is required' }),
  description: z.string().min(1, { message: 'Description is required' }),
  status: z.enum(['PUBLISH', 'DRAFT']),
  show_review: z.string().transform((val) => val === 'true'), // Handle select string to boolean
  start_date: z.string().min(1, { message: 'Start date is required' }),
  end_date: z.string().min(1, { message: 'End date is required' }),
  max_attempt: z.coerce.number().min(1, { message: 'Minimal 1 attempt' }),
  duration: z.coerce.number().min(1, { message: 'Duration is required' }),
})

export default function CreateQuizPage() {
  const router = useRouter()

  // 2. Ambil course_id dari URL
  // Asumsi URL-nya: /backoffice/course/[courseId]/quiz/create
  const params = useParams()
  const courseId = params.id

  const { setBreadcrumb } = useBackofficeBreadcrumb()

  const { addQuizMutation } = useAddQuizMutation({
    successAction: () => {
      form.reset()
    },
  })

  // 3. Konfigurasi Form dengan React Hook Form & Zod
  const form = useForm({
    resolver: zodResolver(quizFormSchema),
    defaultValues: {
      title: '',
      description: '',
      status: 'DRAFT',
      show_review: 'true', // Default value sebagai string untuk Select
      start_date: '',
      end_date: '',
      max_attempt: 1,
      duration: 30,
    },
  })

  useEffect(() => {
    setBreadcrumb([
      { label: 'Dashboard', href: '/backoffice' },
      { label: 'Quiz', href: '#' },
      { label: 'Create', href: '#' },
    ])
  }, [setBreadcrumb])

  // 4. Handle Submit
  const onSubmit = (data) => {
    if (!courseId) {
      toast.error('Course ID not found in URL')
      return
    }

    // Konversi tanggal input (YYYY-MM-DDTHH:mm) ke ISO String (YYYY-MM-DDTHH:mm:ss.sssZ)
    const formattedStartDate = new Date(data.start_date).toISOString()
    const formattedEndDate = new Date(data.end_date).toISOString()

    // Payload final sesuai request
    const payload = {
      title: data.title,
      description: data.description,
      status: data.status,
      show_review: data.show_review, // Sudah di-transform jadi boolean oleh Zod
      start_date: formattedStartDate,
      end_date: formattedEndDate,
      max_attempt: data.max_attempt,
      duration: data.duration,
      course_id: courseId, // Ambil dari URL
    }

    addQuizMutation.mutate({ payload })
  }

  return (
    <div className="w-full">
      <div className="mb-6 flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.push(`/backoffice/course/${courseId}/manage`)}
        >
          <ArrowLeft className="size-5" />
        </Button>
        <h1 className="text-2xl font-bold">Create Quiz</h1>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="mb-6 text-lg font-semibold">Quiz Details</h2>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* --- Title --- */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter quiz title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* --- Description --- */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter quiz description" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {/* --- Start Date --- */}
              <FormField
                control={form.control}
                name="start_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Start Date</FormLabel>
                    <FormControl>
                      <Input type="datetime-local" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* --- End Date --- */}
              <FormField
                control={form.control}
                name="end_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>End Date</FormLabel>
                    <FormControl>
                      <Input type="datetime-local" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {/* --- Duration (Minutes) --- */}
              <FormField
                control={form.control}
                name="duration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Duration (Minutes)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="1"
                        placeholder="30"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* --- Max Attempt --- */}
              <FormField
                control={form.control}
                name="max_attempt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Max Attempt</FormLabel>
                    <FormControl>
                      <Input type="number" min="1" placeholder="3" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {/* --- Status --- */}
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="DRAFT">Draft</SelectItem>
                        <SelectItem value="PUBLISH">Publish</SelectItem>
                        <SelectItem value="ARCHIVED">Archived</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* --- Show Review --- */}
              <FormField
                control={form.control}
                name="show_review"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Show Review</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select option" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="true">Yes, Show Review</SelectItem>
                        <SelectItem value="false">No, Hide Review</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button
                variant="outline"
                type="button"
                disabled={addQuizMutation.isPending}
                onClick={() => router.back()}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={addQuizMutation.isPending}
                className="bg-[#0F172A] hover:bg-[#1e293b]"
              >
                {addQuizMutation.isPending ? 'Saving...' : 'Create Quiz'}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  )
}
