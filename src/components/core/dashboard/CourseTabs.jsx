'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function CourseTabs({ tabs, courseId }) {
  const pathname = usePathname()
  const activeTab =
    tabs.find(
      (tab) => `/dashboard/course/${courseId}/${tab.path}` === pathname
    ) || tabs[0]

  return (
    <div className="mt-6 border-b">
      <div className="flex gap-8 overflow-x-auto">
        {tabs.map((tab) => (
          <Link
            href={`/dashboard/course/${courseId}/${tab.path}`}
            key={tab.path}
          >
            <button
              className={`relative px-2 pb-4 font-medium whitespace-nowrap transition-colors hover:cursor-pointer ${
                activeTab === tab
                  ? 'text-foreground'
                  : 'hover:text-foreground text-gray-500'
              }`}
            >
              {tab.label}
              {activeTab === tab && (
                <div className="absolute right-0 bottom-0 left-0 h-1 rounded-t bg-amber-600"></div>
              )}
            </button>
          </Link>
        ))}
      </div>
    </div>
  )
}
