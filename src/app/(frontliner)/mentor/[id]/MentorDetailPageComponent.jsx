'use client'

import { useRouter } from 'next/navigation'
import {
  ArrowLeft,
  Download,
  ExternalLink,
  Loader2,
  AlertCircle,
  Mail,
  BookOpen,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

import { useGetMentors } from '@/hooks/mentor.hook'
import { getTwoInitials } from '@/utils/helper'
import { useMemo } from 'react'

export default function MentorDetailPageComponent({ mentorId }) {
  // mentorId adalah USER ID
  const router = useRouter()

  // 1. Fetch ALL Accepted Mentorship Records untuk User ID ini
  const { mentors: allMentorships, isLoading } = useGetMentors({
    params: {
      filter: {
        user_id: mentorId,
        status: 'ACCEPTED',
      },
      include_relation: ['user', 'course'],
      pagination: { page: 1, limit: 100 },
    },
    enabled: !!mentorId,
  })

  // 2. Grouping data untuk tampilan
  const groupedData = useMemo(() => {
    if (!allMentorships || allMentorships.length === 0) {
      return { profile: null, mentorships: [] }
    }

    const profile = allMentorships[0]

    // Petakan semua record menjadi array yang fokus pada Course
    const mentorships = allMentorships.map((m) => ({
      id: m.id,
      courseTitle: m.course?.title || 'Unknown Course',
      courseCode: m.course?.code || '',
      bioDetail: m.bio,
      reason: m.reason,
      motivation: m.motivation,
      cvUri: m.cv_uri,
      portfolioUri: m.portfolio_uri,
    }))

    return { profile, mentorships }
  }, [allMentorships])

  const { profile: mentorProfile, mentorships } = groupedData

  // --- LOADING STATE ---
  if (isLoading) {
    return (
      <div className="flex h-[50vh] w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
        <span className="ml-2 text-gray-500">Loading mentor profile...</span>
      </div>
    )
  }

  // --- NOT FOUND STATE ---
  if (!mentorProfile) {
    return (
      <div className="mx-auto w-full max-w-5xl space-y-6 py-32 pb-20 text-center">
        <AlertCircle size={48} className="mx-auto mb-4 text-red-500" />
        <h2 className="text-xl font-semibold">Mentor Not Found</h2>
        <p className="text-muted-foreground">
          Profil mentor tidak ditemukan atau mentor ini tidak aktif di kursus
          manapun.
        </p>
        <Button
          onClick={() => router.push('/mentor')}
          variant="link"
          className="mt-2"
        >
          Go Back to Mentors List
        </Button>
      </div>
    )
  }

  const defaultTabValue = mentorships[0]?.id || 'no-course'

  return (
    <div className="mx-auto w-full max-w-5xl space-y-6 py-32 pb-20">
      {/* HEADER */}
      <div className="flex flex-col justify-between gap-4 border-b pb-4 md:flex-row md:items-center">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="size-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Mentor Detail</h1>
            <p className="text-muted-foreground text-sm">
              Profile and expertise of {mentorProfile.user?.name}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {/* KOLOM KIRI: PROFILE USER STATIC */}
        <div className="space-y-6 md:col-span-1">
          <Card className="border-gray-200 shadow-sm">
            <CardHeader className="flex flex-col items-center border-b border-gray-100 bg-gray-50/50 pb-4 text-center">
              <Avatar className="mb-4 h-24 w-24 border-4 border-white shadow-sm">
                <AvatarImage
                  src={mentorProfile.user?.profile_uri || mentorProfile.cv_uri}
                  alt={mentorProfile.user?.name}
                  className="object-cover"
                />
                <AvatarFallback className="bg-slate-200 text-2xl font-bold text-slate-500">
                  {getTwoInitials(mentorProfile.user?.name || 'M')}
                </AvatarFallback>
              </Avatar>
              <CardTitle className="text-lg font-bold text-gray-900">
                {mentorProfile.user?.name || 'Unknown Name'}
              </CardTitle>

              <div className="mt-2 space-y-3 text-sm">
                <div className="flex items-center justify-center gap-2 text-gray-600">
                  <Mail className="h-4 w-4 shrink-0" />
                  <span className="truncate">
                    {mentorProfile.user?.email || '-'}
                  </span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              {/* LIST ACTIVE MENTORSHIPS */}
              <div>
                <p className="mb-3 text-xs font-semibold text-gray-500 uppercase">
                  Active Mentorships
                </p>
                <div className="flex flex-col gap-3">
                  {mentorships.length > 0 ? (
                    mentorships.map((m) => (
                      <div
                        key={m.id}
                        className="rounded-lg border border-gray-200 bg-gray-50 p-3"
                      >
                        <p className="text-sm leading-tight font-bold text-gray-900">
                          {m.courseTitle}
                        </p>
                        <p className="mt-1 font-mono text-xs text-gray-500">
                          {m.courseCode}
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

        {/* KOLOM KANAN: TAB CONTENT PER COURSE */}
        <div className="space-y-6 md:col-span-2">
          <Card className="border-gray-200 p-0 shadow-sm">
            <CardHeader className="border-b bg-gray-50/50 p-4">
              <CardTitle className="text-lg font-semibold">
                Expertise Details Per Course
              </CardTitle>
            </CardHeader>

            <Tabs defaultValue={defaultTabValue} className="w-full">
              {/* [REVISI] TAB LIST WRAPPER DENGAN SCROLL & FADE KANAN SAJA */}
              <div className="relative border-b bg-white">
                <TabsList className="scrollbar-hide flex h-auto w-full flex-nowrap justify-start overflow-x-auto overflow-y-hidden rounded-none bg-white p-3 whitespace-nowrap">
                  {mentorships.map((m) => (
                    <TabsTrigger
                      key={m.id}
                      value={m.id}
                      // Warna Abu-abu Netral
                      className="flex-shrink-0 bg-gray-100 px-4 py-2 text-xs font-medium text-gray-700 transition-all hover:bg-gray-200 data-[state=active]:bg-gray-800 data-[state=active]:text-white data-[state=active]:shadow-md"
                    >
                      {m.courseTitle}
                    </TabsTrigger>
                  ))}
                </TabsList>

                {/* Fade Kanan SAJA */}
                <div className="pointer-events-none absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-white to-transparent opacity-100"></div>
              </div>

              {/* TAB CONTENTS: Detail Per Course */}
              {mentorships.map((m) => (
                <TabsContent
                  key={m.id}
                  value={m.id}
                  className="mt-0 space-y-6 p-5"
                >
                  {/* Bio (Detailed) */}
                  <div className="space-y-2">
                    <Label className="font-medium text-gray-600">
                      Detailed Bio / Experience (for {m.courseTitle})
                    </Label>
                    <div className="rounded-md border border-gray-200 bg-gray-50 p-4 text-sm whitespace-pre-wrap text-gray-800">
                      {m.bioDetail ||
                        'No detailed biography provided for this course.'}
                    </div>
                  </div>

                  <Separator className="my-4" />

                  {/* Attachments */}
                  <div>
                    <Label className="mb-3 block font-medium text-gray-600">
                      Attachments (Public Links)
                    </Label>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      {/* CV Link */}
                      <a
                        href={m.cvUri}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`flex items-center rounded-lg border border-gray-200 p-3 transition-all ${
                          m.cvUri
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
                            {m.cvUri ? 'Click to view' : 'Not available'}
                          </p>
                        </div>
                      </a>

                      {/* Portfolio Link */}
                      <a
                        href={m.portfolioUri}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`flex items-center rounded-lg border border-gray-200 p-3 transition-all ${
                          m.portfolioUri
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
                            {m.portfolioUri
                              ? 'Click to visit'
                              : 'Not available'}
                          </p>
                        </div>
                      </a>
                    </div>
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </Card>
        </div>
      </div>
    </div>
  )
}
