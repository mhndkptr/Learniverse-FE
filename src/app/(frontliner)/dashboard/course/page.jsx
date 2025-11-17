'use client'

import { useState } from 'react'
import { ArrowLeft, Bookmark, MoreVertical, ChevronRight } from 'lucide-react'
import CourseHeader from '@/components/core/dashboard/CourseHeader'
import CourseTabs from '@/components/core/dashboard/CourseTabs'
import CourseContent from '@/components/core/dashboard/CourseContent'

const tabs = ['All', 'Course', 'Participants', 'Modules', 'Quiz', 'Schedule']

export default function Course() {
  const [activeTab, setActiveTab] = useState('All')

  return (
    <div className="flex">
      <main className="flex w-full flex-col px-16 py-32">
        {/* Header Navigation */}
        <div className="flex items-center justify-between border-b px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <button className="rounded-lg p-2 transition-colors hover:bg-gray-100">
              <ArrowLeft className="text-foreground h-6 w-6" />
            </button>
            <h1 className="text-foreground text-lg font-semibold">
              Course Overview
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <button className="rounded-lg p-2 transition-colors hover:bg-gray-100">
              <Bookmark className="text-foreground h-6 w-6" />
            </button>
            <button className="rounded-lg p-2 transition-colors hover:bg-gray-100">
              <MoreVertical className="text-foreground h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Course Banner */}
        <CourseHeader />

        {/* Tabs Navigation */}
        <CourseTabs
          tabs={tabs}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />

        {/* Content Area */}
        <CourseContent activeTab={activeTab} />
      </main>
    </div>
  )
}
