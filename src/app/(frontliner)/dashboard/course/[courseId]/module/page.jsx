'use client'

import ModuleListItem from '@/components/core/modules/ModuleListItem'
import { useGetAllModule } from '@/hooks/module.hook'
import { useDebounce } from '@/hooks/use-debounce.hook'
import { Search } from 'lucide-react'
import { useParams } from 'next/navigation'
import { useState } from 'react'

export default function ModulesPage() {
  const params = useParams()
  const courseId = params.courseId
  const [searchTerm, setSearchTerm] = useState('')
  const debouncedSearchTerm = useDebounce(searchTerm, 300)
  const { modules, isLoading, isPending } = useGetAllModule({
    params: {
      get_all: true,
      order_by: [
        {
          field: 'created_at',
          direction: 'desc',
        },
      ],
      filter: { course_id: courseId },
      search: debouncedSearchTerm,
    },
  })

  return (
    <div className="flex w-full flex-col space-y-4">
      {/* Search Bar */}
      <div className="">
        <div className="relative max-w-md">
          <Search className="text-muted-foreground absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 transform" />
          <input
            type="text"
            placeholder="Cari modul..."
            className="border-border bg-card text-foreground placeholder-muted-foreground focus:ring-primary w-full rounded-lg border py-2 pr-4 pl-10 focus:ring-2 focus:outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* List Items Section */}
      <div className="space-y-4">
        <h2 className="text-foreground text-lg font-semibold">All Modules</h2>
        {isLoading || isPending ? (
          <p>Loading...</p>
        ) : (
          <>
            <div className="border-border space-y-2 overflow-hidden rounded-lg border">
              {modules.map((module) => (
                <ModuleListItem key={module.id} item={module} />
              ))}
              {modules.length === 0 && (
                <div className="text-muted-foreground p-4 text-center text-sm">
                  No modules found.
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
