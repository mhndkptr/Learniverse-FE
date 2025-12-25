'use client'

import { useEffect } from 'react'
import { useParams, usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowLeft,
  BookOpen,
  CalendarDays,
  FileQuestion,
  Loader2,
  Settings,
  Users,
} from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import {
  CourseManageProvider,
  useCourseManage,
} from './_components/course-manage.context'

const TAB_KEYS = ['general', 'module', 'mentor', 'quiz', 'schedule']
const TAB_DEFS = [
  { key: 'general', label: 'General', icon: Settings },
  { key: 'module', label: 'Modules', icon: BookOpen },
  { key: 'mentor', label: 'Mentors', icon: Users },
  { key: 'quiz', label: 'Quizzes', icon: FileQuestion },
  { key: 'schedule', label: 'Schedules', icon: CalendarDays },
]

function CourseManageLayoutContent({ currentTab, children }) {
  const router = useRouter()
  const { course, isLoading, user, isAdmin } = useCourseManage()
  const isMentor = course?.mentors?.some(
    (mentor) =>
      (mentor.user?.id === user?.id || mentor.user_id === user?.id) &&
      mentor.status === 'ACCEPTED'
  )
  const canAccess = isAdmin || isMentor
  const allowedTabs = isAdmin ? TAB_KEYS : ['module', 'quiz', 'schedule']
  const visibleTabs = TAB_DEFS.filter((tab) => allowedTabs.includes(tab.key))

  useEffect(() => {
    if (!course) return
    if (!allowedTabs.includes(currentTab)) {
      router.replace(`/backoffice/course/${course.id}/manage/${allowedTabs[0]}`)
    }
  }, [allowedTabs, course, currentTab, router])

  if (isLoading)
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="animate-spin text-gray-400" />
      </div>
    )

  if (!course)
    return (
      <div className="py-10 text-center text-red-500">Course Not Found</div>
    )

  if (!canAccess)
    return (
      <div className="flex h-full items-center justify-center px-6 py-24">
        <div className="w-full max-w-lg rounded-xl border border-gray-200 bg-white p-8 text-center shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">Akses ditolak</h2>
          <p className="mt-2 text-sm text-gray-600">
            Anda tidak memiliki akses ke halaman manage course ini.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Button variant="outline" onClick={() => router.back()}>
              Kembali
            </Button>
            <Button
              className="bg-[#0E1B50] text-white hover:bg-blue-900"
              onClick={() => router.push('/')}
            >
              Kembali ke Beranda
            </Button>
          </div>
        </div>
      </div>
    )

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6 py-10">
      <div className="flex items-center gap-4 border-b pb-4">
        {!isMentor && (
          <Link href={`/backoffice/course`}>
            <Button variant="ghost" size="icon">
              <ArrowLeft className="size-5" />
            </Button>
          </Link>
        )}
        <div>
          <h1 className="text-2xl font-bold">Manage Course</h1>
          <p className="text-muted-foreground text-sm">
            {course.title}{' '}
            <span className="rounded bg-gray-100 px-1 font-mono text-xs">
              ({course.code})
            </span>
          </p>
        </div>
      </div>

      <Tabs
        value={allowedTabs.includes(currentTab) ? currentTab : allowedTabs[0]}
        onValueChange={(value) => {
          router.push(`/backoffice/course/${course.id}/manage/${value}`)
        }}
        className="w-full"
      >
        <TabsList
          className="grid w-full gap-2 bg-gray-100 p-1"
          style={{
            gridTemplateColumns: `repeat(${visibleTabs.length}, minmax(0, 1fr))`,
          }}
        >
          {visibleTabs.map((tab) => {
            const Icon = tab.icon
            return (
              <TabsTrigger key={tab.key} value={tab.key} className="gap-2">
                <Icon className="size-4" /> {tab.label}
              </TabsTrigger>
            )
          })}
        </TabsList>
        <TabsContent value={currentTab} className="mt-6">
          {children}
        </TabsContent>
      </Tabs>

      {isMentor && !isAdmin && (
        <div className="flex justify-start">
          <Button
            variant="outline"
            className="border-[#0E1B50] text-[#0E1B50] hover:bg-blue-50"
            onClick={() => router.push(`/dashboard/course/${course.id}`)}
          >
            Back to Course
          </Button>
        </div>
      )}
    </div>
  )
}

export default function CourseManagePageComponent({ children }) {
  const pathname = usePathname()
  const { id } = useParams()

  const lastSegment = pathname.split('/').filter(Boolean).pop()
  const currentTab = TAB_KEYS.includes(lastSegment) ? lastSegment : 'general'
  const isTabRoute = TAB_KEYS.includes(lastSegment)

  if (!isTabRoute) return children

  return (
    <CourseManageProvider courseId={id}>
      <CourseManageLayoutContent currentTab={currentTab}>
        {children}
      </CourseManageLayoutContent>
    </CourseManageProvider>
  )
}
