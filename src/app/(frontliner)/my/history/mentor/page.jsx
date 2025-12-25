'use client'

import Image from 'next/image'
import { AlertCircle, History } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { formatDate } from '@/utils/helper'
import { useGetAllMentorAdmin } from '@/hooks/mentor.hook'
import { useAuth } from '@/contexts/auth.context'

function getMentorStatusBadge(status) {
  switch (status) {
    case 'ACCEPTED':
      return (
        <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
          Accepted
        </Badge>
      )
    case 'ON_REVIEW':
      return (
        <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
          On Review
        </Badge>
      )
    case 'REJECTED':
      return (
        <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
          Rejected
        </Badge>
      )
    default:
      return <Badge variant="outline">Unknown</Badge>
  }
}

export default function MentorHistoryPage() {
  const { user } = useAuth()

  const { mentors, isLoading } = useGetAllMentorAdmin({
    params: {
      filter: { user_id: user?.id },
      include_relation: ['course'],
      order_by: [{ field: 'created_at', direction: 'desc' }],
      get_all: true,
    },
  })

  if (isLoading) return <p className="mt-10 text-center">Loading...</p>

  return (
    <div className="flex h-full">
      <main className="flex h-full w-full flex-col items-center justify-start px-5 py-32 md:px-16">
        <div className="w-full">
          {/* Header */}
          <div className="mb-4 flex items-center gap-3 md:mb-8">
            <History className="h-8 w-8 text-blue-600" />
            <h1 className="text-foreground text-3xl font-bold md:text-4xl">
              Mentor Application History
            </h1>
          </div>
          <p className="text-muted-foreground mb-6 md:mb-8 md:text-lg">
            Track your mentor applications across courses.
          </p>

          {/* List */}
          <div className="space-y-4">
            {mentors.length === 0 ? (
              <div className="border-border rounded-lg border bg-white py-12 text-center">
                <AlertCircle className="text-muted-foreground mx-auto mb-4 h-12 w-12" />
                <p className="text-muted-foreground">
                  You have not applied as a mentor yet.
                </p>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2">
                {mentors.map((item) => (
                  <div
                    key={item.id}
                    className="border-border overflow-hidden rounded-lg border bg-white transition-shadow hover:shadow-lg"
                  >
                    <div className="flex flex-col gap-4 p-4 md:flex-row md:p-6">
                      <div className="shrink-0">
                        <div className="relative h-32 w-32 shrink-0 overflow-hidden rounded-lg md:h-40 md:w-40">
                          <Image
                            src={
                              item?.course?.cover_uri ||
                              '/assets/images/img-image-placeholder.png'
                            }
                            alt={item?.course?.title || 'Course cover'}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 128px, 160px"
                            unoptimized
                          />
                        </div>
                      </div>

                      <div className="flex flex-1 flex-col justify-between">
                        <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                          <div>
                            <h3 className="text-foreground text-lg font-bold md:text-xl">
                              {item?.course?.title || 'Unknown Course'}
                            </h3>
                            <p className="text-muted-foreground text-sm">
                              {item?.course?.code}
                            </p>
                          </div>
                          <div className="flex items-start gap-2 md:flex-col md:items-end">
                            {getMentorStatusBadge(item?.status)}
                            <span className="text-xs text-gray-500">
                              Applied: {formatDate(item?.created_at)}
                            </span>
                          </div>
                        </div>

                        <div className="border-border my-3 grid grid-cols-2 gap-4 border-t border-b py-3 text-xs md:grid-cols-3">
                          <div>
                            <p className="text-muted-foreground">Role</p>
                            <p className="text-foreground font-semibold capitalize">
                              Mentor
                            </p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Status</p>
                            <p className="text-foreground font-semibold">
                              {item?.status?.replace('_', ' ') || '-'}
                            </p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Updated</p>
                            <p className="text-foreground font-semibold">
                              {formatDate(item?.updated_at)}
                            </p>
                          </div>
                        </div>

                        <div className="flex gap-3">
                          <Button
                            variant="secondary"
                            className="flex-1"
                            onClick={() =>
                              item?.course?.id &&
                              (window.location.href = `/course/${item.course.id}`)
                            }
                          >
                            View Course
                          </Button>
                          {item?.status === 'ACCEPTED' && (
                            <Button
                              className="flex-1 bg-blue-600 text-white hover:bg-blue-700"
                              onClick={() =>
                                (window.location.href = '/dashboard/course')
                              }
                            >
                              Go to Dashboard
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
