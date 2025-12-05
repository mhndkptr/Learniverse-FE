'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'

export default function BackofficeCourseEditPage() {
  const router = useRouter()
  const params = useParams()
  const courseId = params?.id

  // sementara dummy data, nanti diganti fetch from backend
  const [form, setForm] = useState({
    title: '',
    description: '',
    price: '',
    status: '',
    thumbnail: null,
  })

  // load data saat masuk page
  useEffect(() => {
    // nanti replace dengan fetch detail course
    const dummyData = {
      title: 'Algorithm Programming',
      description:
        'Unlock your potential with our Programming Algorithm! This course is designed to equip you with essential skills in programming basics.',
      price: 'Rp 50.000',
      status: 'ACTIVE',
      thumbnail: null,
    }

    setForm(dummyData)
  }, [courseId])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm({ ...form, [name]: value })
  }

  const handleFile = (e) => {
    setForm({ ...form, thumbnail: e.target.files[0] })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Updated (dummy)', form)
    alert('Course updated (UI only)')
  }

  return (
    <div className="w-full px-8 py-10">
      {/* Breadcumb */}
      <div className="mb-6 flex items-center gap-2 text-sm text-gray-600">
        <span>Dashboard</span> <span>/</span>
        <span>Courses</span> <span>/</span>
        <span className="font-semibold">Edit</span>
      </div>

      <h2 className="mb-8 text-xl font-semibold">Course Data</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Name & Price */}
        <div className="flex gap-6">
          <div className="w-1/2">
            <label className="mb-1 block text-sm font-medium">
              Course Name
            </label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              className="w-full rounded-md border px-3 py-2"
            />
          </div>

          <div className="w-1/2">
            <label className="mb-1 block text-sm font-medium">Price</label>
            <input
              type="text"
              name="price"
              value={form.price}
              onChange={handleChange}
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
            className="h-28 w-full resize-none rounded-md border px-3 py-2"
          />
        </div>

        {/* Status & Thumbnail */}
        <div className="flex gap-6">
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
