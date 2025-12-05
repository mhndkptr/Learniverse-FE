'use client'

import { useState } from 'react'
import Image from 'next/image'
import { MoreVertical, Edit, Trash2, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function BackofficeCoursePage() {
  const [openMenu, setOpenMenu] = useState(null)
  const [openDeleteModal, setOpenDeleteModal] = useState(false)
  const [selectedCourse, setSelectedCourse] = useState(null)

  // Dummy sementara 
  const courses = [
    {
      id: 1,
      title: 'Programming Algorithm',
      description:
        'Unlock your potential with our Programming Algorithm! This course is designed to equip you with essential skills in programming concepts...',
      price: 'Rp 50.000',
      status: 'ACTIVE',
      thumbnail:
        'https://images.unsplash.com/photo-1551033541-2075d8363c51?q=80&w=800&auto=format&fit=crop',
    },
    {
      id: 2,
      title: 'Web Development',
      description:
        'Learn modern web development techniques using React, Next.js & more...',
      price: 'Rp 75.000',
      status: 'ACTIVE',
      thumbnail:
        'https://images.unsplash.com/photo-1522199710521-72d69614c702?q=80&w=800&auto=format&fit=crop',
    },
  ]

  const handleMenuToggle = (id) => {
    setOpenMenu(openMenu === id ? null : id)
  }

  const handleDeleteClick = (course) => {
    setSelectedCourse(course)
    setOpenDeleteModal(true)
  }

  return (
    <div className="w-full px-8 py-10">
      {/* Header path */}
      <div className="mb-6 flex items-center gap-2 text-sm text-gray-600">
        <span>Dashboard</span> <span>/</span>{' '}
        <span className="font-semibold">Courses</span>
      </div>

      {/* Top section */}
      <div className="mb-6 flex items-center justify-between">
        {/* Search */}
        <div className="flex w-72 items-center gap-2 rounded-md border px-3 py-2">
          <Search size={18} className="text-gray-500" />
          <input
            type="text"
            placeholder="Search course"
            className="w-full text-sm outline-none"
          />
        </div>

        <Button
          className="bg-[#0E1B50] text-white hover:bg-blue-900"
          onClick={() => (window.location.href = '/backoffice/course/create')}
        >
          + Add Course
        </Button>
      </div>

      {/* TABLE */}
      <div className="overflow-hidden rounded-lg border">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 text-left text-gray-600">
            <tr>
              <th className="px-4 py-3">THUMBNAIL</th>
              <th className="px-4 py-3">NAME</th>
              <th className="px-4 py-3">DESCRIPTION</th>
              <th className="px-4 py-3">PRICE</th>
              <th className="px-4 py-3">STATUS</th>
              <th className="px-4 py-3 text-center">ACTION</th>
            </tr>
          </thead>

          <tbody>
            {courses.map((course) => (
              <tr key={course.id} className="border-t hover:bg-gray-50">
                {/* Thumbnail */}
                <td className="px-4 py-3">
                  <Image
                    src={course.thumbnail}
                    alt={course.title}
                    width={70}
                    height={50}
                    className="rounded-md object-cover"
                  />
                </td>

                {/* Name */}
                <td className="px-4 py-3 font-medium">{course.title}</td>

                {/* Description truncate */}
                <td className="px-4 py-3 text-gray-700">
                  {course.description.slice(0, 90)}...
                </td>

                {/* Price */}
                <td className="px-4 py-3">{course.price}</td>

                {/* Status badge */}
                <td className="px-4 py-3">
                  <span
                    className={`rounded px-2 py-1 text-xs ${course.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'} `}
                  >
                    {course.status}
                  </span>
                </td>

                {/* Action */}
                <td className="relative px-4 py-3 text-center">
                  <button onClick={() => handleMenuToggle(course.id)}>
                    <MoreVertical size={18} />
                  </button>

                  {openMenu === course.id && (
                    <div className="absolute right-6 z-10 mt-2 w-28 rounded-md bg-white text-sm shadow-lg">
                      <button
                        className="flex w-full items-center gap-2 px-3 py-2 text-left hover:bg-gray-100"
                        onClick={() =>
                          (window.location.href = `/backoffice/course/${course.id}/edit`)
                        }
                      >
                        <Edit size={14} /> Edit
                      </button>
                      <button
                        className="flex w-full items-center gap-2 px-3 py-2 text-left text-red-600 hover:bg-gray-100"
                        onClick={() => handleDeleteClick(course)}
                      >
                        <Trash2 size={14} /> Delete
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="mt-4 flex items-center justify-end gap-2 text-sm">
        <button className="rounded border px-3 py-1">Previous</button>
        <button className="rounded border bg-[#0E1B50] px-3 py-1 text-white">
          1
        </button>
        <button className="rounded border px-3 py-1">2</button>
        <button className="rounded border px-3 py-1">Next</button>
      </div>

      {/* Delete Modal */}
      {openDeleteModal && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/50">
          <div className="w-[350px] rounded-lg bg-white p-8 text-center shadow-lg">
            <p className="mb-2 text-lg font-semibold">Are You Sure?!</p>
            <p className="mb-6 text-sm">This will be permanently deleted!</p>

            <div className="flex justify-center gap-4">
              <Button className="bg-red-600 text-white hover:bg-red-700">
                Delete
              </Button>
              <Button
                variant="outline"
                onClick={() => setOpenDeleteModal(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
