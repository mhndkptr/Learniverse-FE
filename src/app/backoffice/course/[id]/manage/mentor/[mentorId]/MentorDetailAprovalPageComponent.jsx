'use client'

import { useRouter } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import {
  ArrowLeft,
  Check,
  X,
  Download,
  ExternalLink,
  Loader2,
  AlertCircle,
  User,
  Mail,
  BookOpen,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'

import {
  useGetMentorById,
  useUpdateMentorStatusMutation,
} from '@/hooks/mentor.hook'
import { getAllMentorAdminAction } from '@/actions/mentor.action'
import { getTwoInitials } from '@/utils/helper'

export default function MentorDetailAprovalPageComponent({
  courseId,
  mentorId,
}) {
  const router = useRouter()

  // 1. Fetch Data Mentor
  const { mentor, isLoading, refetch } = useGetMentorById({ id: mentorId })

  // 2. Fetch Data Accepted Mentorships (History User)
  const { data: userHistoryData } = useQuery({
    queryKey: ['mentor-user-history', mentor?.user?.id],
    queryFn: () =>
      getAllMentorAdminAction({
        params: {
          filter: {
            user_id: mentor?.user?.id,
            status: 'ACCEPTED',
          },
          include_relation: ['course'],
          pagination: {
            page: 1,
            limit: 100,
          },
        },
      }),
    enabled: !!mentor?.user?.id,
  })

  const acceptedMentorships = userHistoryData?.data || []

  // 3. Mutation untuk Update Status
  const { mutate: updateStatus, isPending } = useUpdateMentorStatusMutation()

  const handleStatusUpdate = (status) => {
    updateStatus(
      { id: mentorId, status },
      {
        onSuccess: () => {
          router.push(`/backoffice/course/${courseId}/manage`)
        },
      }
    )
  }

  // --- LOADING STATE ---
  if (isLoading) {
    return (
      <div className="flex h-[50vh] w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
        <span className="ml-2 text-gray-500">Loading application data...</span>
      </div>
    )
  }

  // --- NOT FOUND STATE ---
  if (!mentor) {
    return (
      <div className="flex h-[50vh] w-full flex-col items-center justify-center text-red-500">
        <AlertCircle size={48} className="mb-2" />
        <h2 className="text-xl font-semibold">Application Not Found</h2>
        <Button onClick={() => router.back()} variant="link" className="mt-2">
          Go Back
        </Button>
      </div>
    )
  }

  // Helper warna status
  const getStatusBadgeVariant = (status) => {
    switch (status) {
      case 'ACCEPTED':
        return 'bg-green-100 text-green-700 hover:bg-green-100 border-none'
      case 'REJECTED':
        return 'bg-red-100 text-red-700 hover:bg-red-100 border-none'
      default:
        return 'bg-yellow-100 text-yellow-700 hover:bg-yellow-100 border-none'
    }
  }

  return (
    <div className="mx-auto w-full max-w-5xl space-y-6 py-10 pb-20">
      {/* HEADER */}
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="size-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Review Mentor Application</h1>
            <p className="text-muted-foreground text-sm">
              Applying for:{' '}
              <span className="font-semibold text-gray-900">
                {mentor.course?.title}
              </span>
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {/* KOLOM KIRI: PROFILE, STATUS & ACCEPTED COURSES */}
        <div className="space-y-6 md:col-span-1">
          <Card className="border-gray-200 shadow-sm">
            <CardHeader className="flex flex-col items-center border-b border-gray-100 bg-gray-50/50 pb-4 text-center">
              <Avatar className="mb-4 h-24 w-24 border-4 border-white shadow-sm">
                <AvatarImage
                  src={mentor.user?.profile_uri || mentor.cv_uri}
                  alt={mentor.user?.name}
                  className="object-cover"
                />
                <AvatarFallback className="bg-slate-200 text-2xl font-bold text-slate-500">
                  {getTwoInitials(mentor.user?.name || 'M')}
                </AvatarFallback>
              </Avatar>
              <CardTitle className="text-lg font-bold text-gray-900">
                {mentor.user?.name || 'Unknown Name'}
              </CardTitle>
              <div className="mt-2 space-y-3 text-sm">
                <div className="flex items-center justify-center gap-2 text-gray-600">
                  <Mail className="h-4 w-4 shrink-0" />
                  <span className="truncate">{mentor.user?.email || '-'}</span>
                </div>
              </div>
              <div className="mt-3">
                <Badge className={getStatusBadgeVariant(mentor.status)}>
                  {mentor.status.replace('_', ' ')}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              {/* LIST ACCEPTED COURSES  */}
              <div>
                <p className="mb-3 text-xs font-semibold text-gray-500 uppercase">
                  Enrolled In (Accepted)
                </p>
                <div className="flex flex-col gap-3">
                  {acceptedMentorships.length > 0 ? (
                    acceptedMentorships.map((m, idx) => (
                      <div
                        key={m.id || idx}
                        className="rounded-lg border border-gray-200 bg-gray-50 p-3"
                      >
                        <p className="text-sm leading-tight font-bold text-gray-900">
                          {m.course?.title}
                        </p>
                        <p className="mt-1 font-mono text-xs text-gray-500">
                          {m.course?.code}
                        </p>
                      </div>
                    ))
                  ) : (
                    <div className="flex items-center gap-2 rounded-lg border border-dashed border-gray-300 p-3 text-sm text-gray-500">
                      <BookOpen className="h-4 w-4" />
                      <span>No active courses</span>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* KOLOM KANAN: FORM FIELDS (READ ONLY) */}
        <div className="space-y-6 md:col-span-2">
          <Card className="border-gray-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">
                Application Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Bio */}
              <div className="space-y-2">
                <Label className="font-medium text-gray-600">
                  Bio / Introduction
                </Label>
                <div className="rounded-md border border-gray-200 bg-gray-50 p-4 text-sm text-gray-800">
                  {mentor.bio || 'No bio provided.'}
                </div>
              </div>

              {/* Reason */}
              <div className="space-y-2">
                <Label className="font-medium text-gray-600">
                  Reason for Joining
                </Label>
                <Input
                  readOnly
                  value={mentor.reason || ''}
                  className="bg-white"
                />
              </div>

              {/* Motivation */}
              <div className="space-y-2">
                <Label className="font-medium text-gray-600">Motivation</Label>
                <Input
                  readOnly
                  value={mentor.motivation || ''}
                  className="bg-white"
                />
              </div>

              <Separator className="my-2" />

              {/* Attachments */}
              <div>
                <Label className="mb-3 block font-medium text-gray-600">
                  Attachments
                </Label>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {/* CV Link */}
                  <a
                    href={mentor.cv_uri}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex items-center rounded-lg border border-gray-200 p-3 transition-all ${
                      mentor.cv_uri
                        ? 'cursor-pointer hover:border-blue-500 hover:bg-blue-50/50'
                        : 'cursor-not-allowed bg-gray-50 opacity-50'
                    }`}
                  >
                    <div className="mr-3 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                      <Download className="h-5 w-5" />
                    </div>
                    <div className="overflow-hidden">
                      <p className="text-sm font-semibold text-gray-900">
                        Curriculum Vitae
                      </p>
                      <p className="truncate text-xs text-gray-500">
                        {mentor.cv_uri || ''}
                      </p>
                      <p className="truncate text-xs font-semibold text-gray-500">
                        Click to visit URL
                      </p>
                    </div>
                  </a>

                  {/* Portfolio Link */}
                  <a
                    href={mentor.portfolio_uri}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex items-center rounded-lg border border-gray-200 p-3 transition-all ${
                      mentor.portfolio_uri
                        ? 'cursor-pointer hover:border-purple-500 hover:bg-purple-50/50'
                        : 'cursor-not-allowed bg-gray-50 opacity-50'
                    }`}
                  >
                    <div className="mr-3 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-purple-100 text-purple-600">
                      <ExternalLink className="h-5 w-5" />
                    </div>
                    <div className="overflow-hidden">
                      <p className="text-sm font-semibold text-gray-900">
                        Portfolio Link
                      </p>
                      <p className="truncate text-xs text-gray-500">
                        {mentor.portfolio_uri || ''}
                        Click to visit URL
                      </p>
                      <p className="truncate text-xs font-semibold text-gray-500">
                        Click to visit URL
                      </p>
                    </div>
                  </a>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* ACTION BUTTONS */}
          {mentor.status === 'ON_REVIEW' && (
            <div className="flex justify-end gap-3 pt-4">
              <Button
                variant="outline"
                className="border-red-200 bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700"
                onClick={() => handleStatusUpdate('REJECTED')}
                disabled={isPending}
              >
                {isPending ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <X className="mr-2 h-4 w-4" />
                )}
                Reject Application
              </Button>

              <Button
                className="bg-green-600 text-white hover:bg-green-700"
                onClick={() => handleStatusUpdate('ACCEPTED')}
                disabled={isPending}
              >
                {isPending ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Check className="mr-2 h-4 w-4" />
                )}
                Approve Mentor
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
