'use client'

import { useMemo, useState } from 'react'
import { useParams } from 'next/navigation'
import { Search } from 'lucide-react'

import { useEnrollmentList } from '@/hooks/enrollment.hook'
import { useDebounce } from '@/hooks/use-debounce.hook'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export default function CourseParticipantPage() {
  const params = useParams()
  const courseId = params?.courseId

  const [searchTerm, setSearchTerm] = useState('')
  const debouncedSearchTerm = useDebounce(searchTerm, 300)
  const [sortOrder, setSortOrder] = useState('asc')

  const { enrollments, isLoading, isPending } = useEnrollmentList({
    params: {
      get_all: true,
      search: debouncedSearchTerm || undefined,
      filter: {
        course_id: courseId,
      },
      include_relation: ['user'],
      order_by: [{ field: 'created_at', direction: 'desc' }],
    },
  })

  const sortedEnrollments = useMemo(() => {
    const rows = [...(enrollments || [])]
    const sorted = rows.sort((a, b) =>
      (a.user?.name || '').localeCompare(b.user?.name || '')
    )
    return sortOrder === 'desc' ? sorted.reverse() : sorted
  }, [enrollments, sortOrder])

  if (!courseId) {
    return (
      <div className="text-muted-foreground text-sm">
        Course tidak ditemukan.
      </div>
    )
  }

  return (
    <div className="flex w-full flex-col space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-foreground text-2xl font-bold">
            Course Participants
          </h2>
          <p className="text-muted-foreground text-sm">
            List of all participants enrolled in this course.
          </p>
        </div>
        <div className="text-muted-foreground text-sm">
          Total: {sortedEnrollments.length}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative w-full max-w-sm">
          <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
          <Input
            placeholder="Search name or email..."
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={sortOrder} onValueChange={setSortOrder}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Sort" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="asc">Name (A-Z)</SelectItem>
            <SelectItem value="desc">Name (Z-A)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isLoading || isPending ? (
        <p className="text-muted-foreground text-sm">Loading...</p>
      ) : sortedEnrollments.length === 0 ? (
        <div className="rounded-lg border border-dashed border-gray-200 bg-white p-8 text-center text-sm text-gray-500">
          Belum ada participant untuk course ini.
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {sortedEnrollments.map((enrollment) => {
            const user = enrollment.user
            const initials =
              user?.name
                ?.split(' ')
                .slice(0, 2)
                .map((item) => item[0])
                .join('')
                .toUpperCase() || 'NA'

            return (
              <div
                key={enrollment.id}
                className="flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm"
              >
                <Avatar className="h-12 w-12">
                  <AvatarImage
                    src={
                      user?.profile_uri ||
                      '/assets/images/img-avatar-placeholder.png'
                    }
                    alt={user?.name || 'User'}
                  />
                  <AvatarFallback>{initials}</AvatarFallback>
                </Avatar>
                <div className="flex min-w-0 flex-1 flex-col">
                  <span className="truncate text-sm font-semibold text-gray-900">
                    {user?.name || 'User tidak ditemukan'}
                  </span>
                  <span className="truncate text-xs text-gray-500">
                    {user?.email || '-'}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
