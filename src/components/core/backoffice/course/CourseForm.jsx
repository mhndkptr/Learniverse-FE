'use client'

import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Loader2, UploadCloud } from 'lucide-react'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import BaseForm from '@/components/_shared/BaseForm'

const courseSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(150),
  code: z
    .string()
    .min(3)
    .max(10)
    .regex(/^[a-zA-Z0-9]+$/, 'Code must be alphanumeric (no spaces)'),
  price: z.coerce.number().min(0, 'Price must be 0 or greater'),
  description: z.string().optional(),
  content: z.string().min(1, 'Content/Syllabus is required'),
  is_open_registration_member: z.boolean().default(false),
  is_open_registration_mentor: z.boolean().default(false),
  cover: z.any().optional(),
})

export default function CourseForm({
  defaultValues,
  onSubmit,
  isLoading,
  onDelete,
}) {
  const [preview, setPreview] = useState(null)

  const form = useForm({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      title: '',
      code: '',
      price: '',
      description: '',
      content: '',
      is_open_registration_member: false,
      is_open_registration_mentor: false,
      cover: null,
    },
  })

  useEffect(() => {
    if (defaultValues) {
      form.reset({
        title: defaultValues.title || '',
        code: defaultValues.code || '',
        price: defaultValues.price || 0,
        description: defaultValues.description || '',
        content: defaultValues.content || '',
        is_open_registration_member:
          defaultValues.is_open_registration_member || false,
        is_open_registration_mentor:
          defaultValues.is_open_registration_mentor || false,
      })
      if (defaultValues.cover_uri) {
        setPreview(defaultValues.cover_uri)
      }
    }
  }, [defaultValues, form])

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      form.setValue('cover', file, { shouldValidate: true })
      setPreview(URL.createObjectURL(file))
    }
  }

  return (
    <BaseForm
      formConfig={form}
      onSubmit={onSubmit}
      className="grid grid-cols-1 gap-6 rounded-lg border bg-white p-6 shadow-sm md:grid-cols-12"
    >
      {/* ================= LEFT ================= */}
      <div className="space-y-4 md:col-span-8">
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Course Name *</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. Fullstack Javascript" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="code"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Course Code *</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. FSJS2025" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Price (IDR) *</FormLabel>
              <FormControl>
                <Input type="number" min="0" placeholder="0" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* ================= RIGHT ================= */}
      <div className="space-y-4 md:col-span-4">
        <div>
          <FormLabel className="mb-2 block">Thumbnail Image</FormLabel>

          {preview ? (
            <div className="mt-1 flex justify-center rounded-md border-2 border-dashed border-gray-300 px-6 pt-5 pb-6">
              <div className="space-y-1 text-center">
                <div className="relative mb-2 h-40 w-full">
                  <img
                    src={preview}
                    className="mx-auto h-full rounded object-cover"
                    alt="Preview"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      form.setValue('cover', null)
                      setPreview(null)
                    }}
                    className="mt-1 text-xs text-red-500 underline"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <label
              htmlFor="file-upload"
              className="mt-1 flex cursor-pointer justify-center rounded-md border-2 border-dashed border-gray-300 px-6 pt-5 pb-6 transition hover:bg-gray-50"
            >
              <div className="space-y-1 text-center">
                <div className="flex flex-col items-center">
                  <UploadCloud className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="mt-2 flex text-sm text-gray-600">
                    <span className="font-medium text-blue-600 hover:text-blue-500">
                      Click to Upload
                    </span>
                    <input
                      id="file-upload"
                      type="file"
                      accept="image/*"
                      className="sr-only"
                      onChange={handleFileChange}
                    />
                  </div>
                  <p className="mt-1 text-xs text-gray-500">
                    PNG, JPG, GIF up to 5MB
                  </p>
                </div>
              </div>
            </label>
          )}
        </div>

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Short Description</FormLabel>
              <FormControl>
                <textarea
                  {...field}
                  className="h-32 w-full rounded-md border px-3 py-2 text-sm"
                  placeholder="Brief summary for card view..."
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* ================= FOOTER ================= */}
      <div className="mt-2 flex justify-between border-t pt-6 md:col-span-12">
        {onDelete && (
          <Button
            type="button"
            onClick={onDelete}
            variant="destructive"
            className="h-max"
          >
            Remove Course
          </Button>
        )}

        <div className="flex gap-3">
          <Button
            type="button"
            onClick={() => window.history.back()}
            variant="secondary"
            className="bg-gray-100 text-gray-800 hover:bg-gray-200"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isLoading}
            className="min-w-[140px] bg-[#0E1B50] text-white hover:bg-blue-900"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
              </>
            ) : (
              'Save Course'
            )}
          </Button>
        </div>
      </div>
    </BaseForm>
  )
}
