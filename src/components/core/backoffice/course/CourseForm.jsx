'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'

export default function CourseForm({ defaultValues, onSubmit, isLoading }) {
  const [form, setForm] = useState({
    title: '',
    code: '',
    description: '',
    content: '',
    price: '',
    is_open_registration_member: false, 
    is_open_registration_mentor: false, 
    cover: null,
    preview: null,
  })

 
  useEffect(() => {
    if (defaultValues) {
      setForm({
        title: defaultValues.title || '',
        code: defaultValues.code || '',
        description: defaultValues.description || '',
        content: defaultValues.content || defaultValues.description || '',
        price: defaultValues.price || 0,

        is_open_registration_member:
          defaultValues.is_open_registration_member || false,
        is_open_registration_mentor:
          defaultValues.is_open_registration_mentor || false,
        cover: null,
        preview: defaultValues.cover_uri,
      })
    }
  }, [defaultValues])

  const handleFile = (e) => {
    const f = e.target.files[0]
    if (f) setForm((p) => ({ ...p, cover: f, preview: URL.createObjectURL(f) }))
  }

  // Handle perubahan input text & checkbox
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        onSubmit(form)
      }}
      className="grid grid-cols-1 gap-6 rounded-lg border bg-white p-6 shadow-sm md:grid-cols-12"
    >
      {/* --- KIRI (Info Utama) --- */}
      <div className="space-y-4 md:col-span-8">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1 block text-sm font-semibold text-gray-700">
              Course Name *
            </label>
            <input
              name="title"
              required
              className="w-full rounded-md border border-gray-300 p-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
              value={form.title}
              onChange={handleChange}
              placeholder="e.g. Fullstack Javascript"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-semibold text-gray-700">
              Course Code *
            </label>
            <input
              name="code"
              required
              className="w-full rounded-md border border-gray-300 p-2 font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
              value={form.code}
              onChange={handleChange}
              placeholder="e.g. FSJS2025"
            />
          </div>
        </div>

        <div>
          <label className="mb-1 block text-sm font-semibold text-gray-700">
            Price (IDR) *
          </label>
          <input
            name="price"
            type="number"
            required
            min="0"
            className="w-full rounded-md border border-gray-300 p-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
            value={form.price}
            onChange={handleChange}
          />
        </div>

        {/* --- BAGIAN STATUS  --- */}
        <div>
          <label className="mb-2 block text-sm font-semibold text-gray-700">
            Registration Status
          </label>
          <div className="grid grid-cols-2 gap-4">
            {/* Checkbox Member */}
            <label
              className={`flex cursor-pointer items-center space-x-3 rounded-md border p-3 transition-colors ${form.is_open_registration_member ? 'border-blue-200 bg-blue-50' : 'hover:bg-gray-50'}`}
            >
              <input
                type="checkbox"
                name="is_open_registration_member"
                checked={form.is_open_registration_member}
                onChange={handleChange}
                className="h-5 w-5 rounded text-blue-600 focus:ring-blue-500"
              />
              <div>
                <span className="block text-sm font-medium text-gray-900">
                  Open for Member
                </span>
                <span className="block text-xs text-gray-500">
                  Allow students to enroll
                </span>
              </div>
            </label>

            {/* Checkbox Mentor */}
            <label
              className={`flex cursor-pointer items-center space-x-3 rounded-md border p-3 transition-colors ${form.is_open_registration_mentor ? 'border-indigo-200 bg-indigo-50' : 'hover:bg-gray-50'}`}
            >
              <input
                type="checkbox"
                name="is_open_registration_mentor"
                checked={form.is_open_registration_mentor}
                onChange={handleChange}
                className="h-5 w-5 rounded text-indigo-600 focus:ring-indigo-500"
              />
              <div>
                <span className="block text-sm font-medium text-gray-900">
                  Open for Mentor
                </span>
                <span className="block text-xs text-gray-500">
                  Allow mentors to apply
                </span>
              </div>
            </label>
          </div>
        </div>

        <div>
          <label className="mb-1 block text-sm font-semibold text-gray-700">
            Full Content / Syllabus *
          </label>
          <textarea
            name="content"
            required
            className="h-64 w-full rounded-md border border-gray-300 bg-gray-50 p-2 font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
            value={form.content}
            onChange={handleChange}
            placeholder="Detailed explanation of the course, markdown supported..."
          />
        </div>
      </div>

      {/* --- KANAN (Gambar & Deskripsi Singkat) --- */}
      <div className="space-y-4 md:col-span-4">
        <div>
          <label className="mb-1 block text-sm font-semibold text-gray-700">
            Thumbnail Image
          </label>
          <div className="mt-1 flex justify-center rounded-md border-2 border-dashed border-gray-300 px-6 pt-5 pb-6 transition hover:bg-gray-50">
            <div className="space-y-1 text-center">
              {form.preview ? (
                <div className="relative mb-2 h-40 w-full">
                  <img
                    src={form.preview}
                    className="mx-auto h-full rounded object-cover"
                    alt="Preview"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setForm((p) => ({ ...p, cover: null, preview: null }))
                    }
                    className="mt-1 text-xs text-red-500 underline"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <svg
                    className="mx-auto h-12 w-12 text-gray-400"
                    stroke="currentColor"
                    fill="none"
                    viewBox="0 0 48 48"
                    aria-hidden="true"
                  >
                    <path
                      d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <div className="flex text-sm text-gray-600">
                    <label
                      htmlFor="file-upload"
                      className="relative cursor-pointer rounded-md bg-white font-medium text-blue-600 focus-within:outline-none hover:text-blue-500"
                    >
                      <span>Upload a file</span>
                      <input
                        id="file-upload"
                        name="file-upload"
                        type="file"
                        accept="image/*"
                        className="sr-only"
                        onChange={handleFile}
                      />
                    </label>
                  </div>
                  <p className="text-xs text-gray-500">
                    PNG, JPG, GIF up to 5MB
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div>
          <label className="mb-1 block text-sm font-semibold text-gray-700">
            Short Description
          </label>
          <textarea
            name="description"
            className="h-32 w-full rounded-md border border-gray-300 p-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
            value={form.description}
            onChange={handleChange}
            placeholder="Brief summary for card view..."
          />
        </div>
      </div>

      {/* --- TOMBOL AKSI --- */}
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
    </form>
  )
}
