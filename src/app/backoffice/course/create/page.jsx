'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'

export default function BackofficeCourseCreatePage() {
  const router = useRouter()

  const [form, setForm] = useState({
    title: '',
    description: '',
    price: '',
    status: '',
    thumbnail: null,
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm({ ...form, [name]: value })
  }

  const handleFile = (e) => {
    setForm({ ...form, thumbnail: e.target.files[0] })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Course Created (dummy)', form)
    alert('Course saved (UI only)')
  }

  return (
    <div className="w-full px-8 py-10">
      {/* Breadcumb */}
      <div className="mb-6 flex items-center gap-2 text-sm text-gray-600">
        <span>Dashboard</span> <span>/</span>
        <span>Courses</span> <span>/</span>
        <span className="font-semibold">Create</span>
      </div>

      <h2 className="mb-8 text-xl font-semibold">Course Data</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex gap-6">
          {/* Course Name */}
          <div className="w-1/2">
            <label className="mb-1 block text-sm font-medium">
              Course Name
            </label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Enter course name"
              className="w-full rounded-md border px-3 py-2"
            />
          </div>

          {/* Price */}
          <div className="w-1/2">
            <label className="mb-1 block text-sm font-medium">Price</label>
            <input
              type="text"
              name="price"
              value={form.price}
              onChange={handleChange}
              placeholder="Enter price course"
              className="w-full rounded-md border px-3 py-2"
            />
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="mb-1 block text-sm font-medium">Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Enter course description"
            className="h-28 w-full resize-none rounded-md border px-3 py-2"
          />
        </div>

        <div className="flex gap-6">
          {/* Status */}
          <div className="w-1/2">
            <label className="mb-1 block text-sm font-medium">Status</label>
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              className="w-full rounded-md border px-3 py-2"
            >
              <option value="">Choose course status</option>
              <option value="ACTIVE">ACTIVE</option>
              <option value="INACTIVE">INACTIVE</option>
            </select>
          </div>

          {/* Thumbnail Upload */}
          <div className="w-1/2">
            <label className="mb-1 block text-sm font-medium">Thumbnail</label>
            <div className="flex items-center gap-2">
              <input type="file" accept="image/*" onChange={handleFile} />
              <span className="text-sm opacity-50">
                Upload Course Thumbnail
              </span>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-3 pt-4">
          <Button
            type="submit"
            className="bg-[#0E1B50] px-6 text-white hover:bg-blue-900"
          >
            Save
          </Button>

          <Button
            type="button"
            className="bg-red-600 px-6 text-white hover:bg-red-700"
            onClick={() => router.push('/backoffice/course')}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  )
}
