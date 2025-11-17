'use client'

import { Button } from '@/components/ui/button'
import Image from 'next/image'
import MentorCard from '@/components/core/course/MentorCard'
import EnrollCourseDialog from '@/components/core/course/EnrollCourseDialog'

export default function CourseDetailPage() {
  const course = {
    title: 'Programming Algorithm',
    description:
      'Unlock your potential with our Programming Algorithm! This course is designed to equip you with essential skills in programming concepts, their functions, and their implementation, enabling you to excel in programming basics.',
    cover_uri:
      'https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=1200&auto=format&fit=crop',
    price: 100000,
    learn:
      'Lorem ipsum odor amet, consectetur adipiscing elit. Tempus bibendum nisi duis mauris mauris conubia.',
    benefits: [
      'Lorem ipsum odor amet',
      'Lorem ipsum odor amet',
      'Lorem ipsum odor amet',
      'Lorem ipsum odor amet',
    ],
    mentors: [
      {
        name: 'Emily R.',
        expertise: 'Data Science & Analytics',
        photo: 'https://randomuser.me/api/portraits/women/44.jpg',
      },
      {
        name: 'Emily R.',
        expertise: 'Data Science & Analytics',
        photo: 'https://randomuser.me/api/portraits/women/45.jpg',
      },
      {
        name: 'Emily R.',
        expertise: 'Data Science & Analytics',
        photo: 'https://randomuser.me/api/portraits/women/46.jpg',
      },
    ],
  }

  return (
    <div className="flex items-center justify-center">
      <main className="flex w-full flex-col items-center justify-between px-16 py-32">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Left: Cover + Description */}
          <div className="space-y-6 lg:col-span-2">
            <div className="flex flex-col gap-6 md:flex-row">
              <Image
                src={course.cover_uri}
                alt={course.title}
                width={350}
                height={200}
                className="h-[220px] w-full rounded-lg object-cover md:w-[350px]"
              />
              <div>
                <h1 className="mb-3 text-3xl font-bold text-gray-900">
                  {course.title}
                </h1>
                <p className="text-gray-700">{course.description}</p>
              </div>
            </div>

            {/* What You Learn */}
            <div className="rounded-lg border bg-white p-6 shadow-sm">
              <h2 className="mb-2 text-lg font-semibold text-blue-950">
                What You Learn
              </h2>
              <p className="leading-relaxed text-gray-700">{course.learn}</p>
            </div>

            {/* Benefits */}
            <div className="rounded-lg border bg-white p-6 shadow-sm">
              <h2 className="mb-2 text-lg font-semibold text-blue-950">
                Benefits of Taking This Course
              </h2>
              <ul className="list-inside list-disc space-y-1 text-gray-700">
                {course.benefits.map((benefit, index) => (
                  <li key={index}>{benefit}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right: Sidebar */}
          <div className="space-y-6">
            {/* Enroll */}
            <div className="rounded-lg border bg-white p-6 shadow-sm">
              <h2 className="mb-3 text-lg font-semibold text-gray-900">
                Enroll In This Course
              </h2>

              {/* ✅ Gunakan Dialog Enroll */}
              <EnrollCourseDialog course={course} />

              <p className="mt-3 text-xs text-gray-500">
                By enrolling in this course, you agree to our terms and
                conditions.
              </p>
            </div>

            {/* Mentor */}
            <div className="rounded-lg border bg-white p-6 shadow-sm">
              <h2 className="mb-3 text-lg font-semibold text-blue-950">
                Mentor in this course
              </h2>
              <div className="space-y-3">
                {course.mentors.map((mentor, index) => (
                  <MentorCard key={index} mentor={mentor} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
