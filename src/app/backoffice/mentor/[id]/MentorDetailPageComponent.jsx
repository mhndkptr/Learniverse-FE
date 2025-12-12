'use client'

import { useRouter } from 'next/navigation'
import {
  ArrowLeft,
  Check,
  X,
  Download,
  ExternalLink,
  Mail,
  User,
  Loader2,
  AlertCircle,
} from 'lucide-react'

// Components
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

// Hooks & Utils
import {
  useGetMentorById,
  useUpdateMentorStatusMutation,
} from '@/hooks/mentor.hook'
import { getTwoInitials, formatDate } from '@/utils/helper'

export default function MentorDetailPageComponent({ id }) {
  const router = useRouter()

  // 1. Fetch Data Mentor
  const { mentor, isLoading, refetch } = useGetMentorById({ id })

  // 2. Mutation untuk Update Status
  const { mutate: updateStatus, isPending } = useUpdateMentorStatusMutation()

  const handleStatusUpdate = (status) => {
    updateStatus(
      { id, status },
      {
        onSuccess: () => {
          refetch() // Refresh data setelah update
        },
      }
    )
  }

  // --- LOADING STATE ---
  if (isLoading) {
    return (
      <div className="flex h-[50vh] w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
        <span className="ml-2 text-gray-500">Loading mentor detail...</span>
      </div>
    )
  }

  // --- NOT FOUND STATE ---
  if (!mentor) {
    return (
      <div className="flex h-[50vh] w-full flex-col items-center justify-center text-red-500">
        <AlertCircle size={48} className="mb-2" />
        <h2 className="text-xl font-semibold">Mentor Not Found</h2>
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
    <div className="mx-auto w-full max-w-5xl space-y-6 py-10">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="size-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Mentor Detail</h1>
            <p className="text-muted-foreground text-sm">
              Application ID:{' '}
              <span className="font-mono">{mentor.id.slice(0, 8)}...</span>
            </p>
          </div>
        </div>

        {/* ACTION BUTTONS (Hanya jika ON_REVIEW) */}
        {mentor.status === 'ON_REVIEW' && (
          <div className="flex gap-3">
            <Button
              variant="destructive"
              className="bg-red-600 hover:bg-red-700"
              onClick={() => handleStatusUpdate('REJECTED')}
              disabled={isPending}
            >
              {isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <X className="mr-2 h-4 w-4" />
              )}
              Reject
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
              Approve
            </Button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {/* KOLOM KIRI: PROFILE & STATUS */}
        <div className="space-y-6 md:col-span-1">
          <Card className="shadow-sm">
            <CardHeader className="flex flex-col items-center pb-2 text-center">
              <Avatar className="mb-4 h-24 w-24 border-2 border-gray-100">
                <AvatarImage
                  src={mentor.user?.profile_uri || mentor.cv_uri}
                  alt={mentor.user?.name}
                  className="object-cover"
                />
                <AvatarFallback className="bg-blue-50 text-2xl font-bold text-blue-600">
                  {getTwoInitials(mentor.user?.name || 'Mentor')}
                </AvatarFallback>
              </Avatar>
              <CardTitle className="text-xl font-bold">
                {mentor.user?.name || 'Unknown Name'}
              </CardTitle>
              <div className="mt-2">
                <Badge className={getStatusBadgeVariant(mentor.status)}>
                  {mentor.status.replace('_', ' ')}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4 pt-4">
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-3 text-gray-600">
                  <User className="h-4 w-4 shrink-0" />
                  <span className="truncate">
                    @{mentor.user?.username || '-'}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-gray-600">
                  <Mail className="h-4 w-4 shrink-0" />
                  <span className="truncate">{mentor.user?.email || '-'}</span>
                </div>
              </div>

              <Separator />

              <div>
                <p className="mb-2 text-xs font-semibold text-gray-500 uppercase">
                  Assigned Course
                </p>
                {mentor.course ? (
                  <div className="rounded-lg border border-gray-100 bg-gray-50 p-3">
                    <p className="font-semibold text-gray-900">
                      {mentor.course.title}
                    </p>
                    <p className="mt-1 font-mono text-xs text-gray-500">
                      {mentor.course.code}
                    </p>
                  </div>
                ) : (
                  <p className="text-sm text-gray-400 italic">
                    No course assigned
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* KOLOM KANAN: APPLICATION INFO */}
        <div className="space-y-6 md:col-span-2">
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">Application Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Bio */}
              <div>
                <h3 className="mb-2 text-sm font-semibold text-gray-900">
                  Bio / Introduction
                </h3>
                <div className="rounded-lg border border-gray-100 bg-gray-50 p-4 text-sm leading-relaxed text-gray-600">
                  {mentor.bio || 'No bio provided.'}
                </div>
              </div>

              {/* Reason & Motivation */}
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <h3 className="mb-2 text-sm font-semibold text-gray-900">
                    Reason for Joining
                  </h3>
                  <p className="text-sm leading-relaxed text-gray-600">
                    {mentor.reason || '-'}
                  </p>
                </div>
                <div>
                  <h3 className="mb-2 text-sm font-semibold text-gray-900">
                    Motivation
                  </h3>
                  <p className="text-sm leading-relaxed text-gray-600">
                    {mentor.motivation || '-'}
                  </p>
                </div>
              </div>

              <Separator />

              {/* Attachments */}
              <div>
                <h3 className="mb-4 text-sm font-semibold text-gray-900">
                  Attachments
                </h3>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {/* CV Link */}
                  <a
                    href={mentor.cv_uri}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex items-center rounded-lg border border-gray-200 p-4 transition-all ${
                      mentor.cv_uri
                        ? 'cursor-pointer hover:border-blue-500 hover:shadow-sm'
                        : 'cursor-not-allowed opacity-50'
                    }`}
                  >
                    <div className="mr-3 flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                      <Download className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        Curriculum Vitae
                      </p>
                      <p className="text-xs text-gray-500">
                        Click to view document
                      </p>
                    </div>
                  </a>

                  {/* Portfolio Link */}
                  <a
                    href={mentor.portfolio_uri}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex items-center rounded-lg border border-gray-200 p-4 transition-all ${
                      mentor.portfolio_uri
                        ? 'cursor-pointer hover:border-purple-500 hover:shadow-sm'
                        : 'cursor-not-allowed opacity-50'
                    }`}
                  >
                    <div className="mr-3 flex h-10 w-10 items-center justify-center rounded-full bg-purple-50 text-purple-600">
                      <ExternalLink className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        Portfolio
                      </p>
                      <p className="text-xs text-gray-500">
                        Click to visit link
                      </p>
                    </div>
                  </a>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
