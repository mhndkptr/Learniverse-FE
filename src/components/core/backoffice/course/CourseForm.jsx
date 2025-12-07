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

// Schema Validasi
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

export default function CourseForm({ defaultValues, onSubmit, isLoading }) {
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

  // Load data (edit mode)
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
      {/* KIRI */}
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

        {/* Status Checkboxes */}
        <div>
          <FormLabel className="mb-2 block">Registration Status</FormLabel>
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="is_open_registration_member"
              render={({ field }) => (
                <FormItem
                  // Logic Klik Container
                  onClick={(e) => {
                    if (e.target.type !== 'checkbox') {
                      field.onChange(!field.value)
                    }
                  }}
                  className={`flex cursor-pointer items-center space-y-0 space-x-3 rounded-md border p-3 transition-colors ${
                    field.value
                      ? 'border-blue-200 bg-blue-50'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <FormControl>
                    <input
                      type="checkbox"
                      checked={field.value}
                      onChange={field.onChange}
                      className="h-5 w-5 cursor-pointer rounded text-blue-600 focus:ring-blue-500"
                    />
                  </FormControl>
                  <div>
                    <span className="block text-sm font-medium text-gray-900 select-none">
                      Open for Member
                    </span>
                    <span className="block text-xs text-gray-500 select-none">
                      Allow students to enroll
                    </span>
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="is_open_registration_mentor"
              render={({ field }) => (
                <FormItem
                  // Logic Klik Container
                  onClick={(e) => {
                    if (e.target.type !== 'checkbox') {
                      field.onChange(!field.value)
                    }
                  }}
                  className={`flex cursor-pointer items-center space-y-0 space-x-3 rounded-md border p-3 transition-colors ${
                    field.value
                      ? 'border-indigo-200 bg-indigo-50'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <FormControl>
                    <input
                      type="checkbox"
                      checked={field.value}
                      onChange={field.onChange}
                      className="h-5 w-5 cursor-pointer rounded text-indigo-600 focus:ring-indigo-500"
                    />
                  </FormControl>
                  <div>
                    <span className="block text-sm font-medium text-gray-900 select-none">
                      Open for Mentor
                    </span>
                    <span className="block text-xs text-gray-500 select-none">
                      Allow mentors to apply
                    </span>
                  </div>
                </FormItem>
              )}
            />
          </div>
        </div>

        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Content / Syllabus *</FormLabel>
              <FormControl>
                <textarea
                  {...field}
                  className="border-input placeholder:text-muted-foreground focus-visible:ring-ring h-64 w-full rounded-md border bg-transparent px-3 py-2 text-sm shadow-sm focus-visible:ring-1 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="Detailed explanation of the course..."
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* KANAN */}
      <div className="space-y-4 md:col-span-4">
        <div>
          <FormLabel className="mb-2 block">Thumbnail Image</FormLabel>

          {preview ? (
            // STATE: PREVIEW (Sudah ada gambar)
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
            // STATE: UPLOAD (Belum ada gambar)
            <label
              htmlFor="file-upload"
              className="mt-1 flex cursor-pointer justify-center rounded-md border-2 border-dashed border-gray-300 px-6 pt-5 pb-6 transition hover:bg-gray-50"
            >
              <div className="space-y-1 text-center">
                <div className="flex flex-col items-center">
                  <UploadCloud className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="mt-2 flex text-sm text-gray-600">
                    <span className="font-medium text-blue-600 focus-within:outline-none hover:text-blue-500">
                      Click to Upload
                    </span>
                    <input
                      id="file-upload"
                      name="file-upload"
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
                  className="border-input placeholder:text-muted-foreground focus-visible:ring-ring h-32 w-full rounded-md border bg-transparent px-3 py-2 text-sm shadow-sm focus-visible:ring-1 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="Brief summary for card view..."
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="mt-2 flex justify-end gap-3 border-t pt-6 md:col-span-12">
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
    </BaseForm>
  )
}
