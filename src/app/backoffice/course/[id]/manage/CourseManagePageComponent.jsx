'use client'

import { useRouter } from 'next/navigation'
import { useMemo, useState } from 'react'
import {
  useGetCourseByIdAdmin,
  useUpdateCourseAdminMutation,
} from '@/hooks/course.hook'
import CourseForm from '@/components/core/backoffice/course/CourseForm'
import {
  Loader2,
  ArrowLeft,
  BookOpen,
  Users,
  CalendarDays,
  FileQuestion,
  Settings,
  Plus,
  Trash2,
  Pencil,
  SquareArrowOutUpRight,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import BaseTable from '@/components/_shared/BaseTable'
import { Badge } from '@/components/ui/badge'
import BackofficeCourseModuleAddDialog from '@/components/core/backoffice/course/module/BackofficeCourseModuleAddDialog'
import BackofficeCourseModuleEditDialog from '@/components/core/backoffice/course/module/BackofficeCourseModuleEditDialog'
import ConfirmDialogDelete from '@/components/core/backoffice/course/ConfirmDialogDelete'
import { useDeleteModuleMutation } from '@/hooks/module.hook'
import { se } from 'date-fns/locale'

export default function CourseManagePageComponent({ id }) {
  const router = useRouter()
  const { course, isLoading, refetch } = useGetCourseByIdAdmin({ courseId: id })
  const updateCourseMutation = useUpdateCourseAdminMutation({
    onSuccess: () => refetch(),
  })
  const { deleteModuleMutation } = useDeleteModuleMutation({
    successAction: () => {
      setShowDelete({ status: false, data: null, mutation: null })
    },
  })

  const [showDelete, setShowDelete] = useState({
    status: false,
    data: null,
    mutation: null,
  })
  const [isDeleting, setIsDeleting] = useState(false)

  const [showAddModule, setShowAddModule] = useState({
    status: false,
  })
  const [showEditModule, setShowEditModule] = useState({
    status: false,
    data: null,
  })

  // --- KOLOM TABEL RELASI ---
  const moduleColumns = useMemo(
    () => [
      { key: 'title', header: 'Module Title', sortable: true },
      { key: 'file_name', header: 'File Name' },
      {
        key: 'actions',
        header: 'Action',
        render: (row) => (
          <div className="flex gap-2">
            <Button
              size="icon"
              variant="ghost"
              onClick={() => window.open(row.modul_uri, '_blank')}
              className="h-8 w-8 text-blue-600"
            >
              <SquareArrowOutUpRight className="size-4" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8 text-amber-600"
              onClick={() =>
                setShowEditModule({
                  data: !showEditModule.status && row ? row : null,
                  status: !showEditModule.status,
                })
              }
            >
              <Pencil className="size-4" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8 text-red-600"
              onClick={() =>
                setShowDelete({
                  status: true,
                  data: row,
                  mutation: deleteModuleMutation,
                })
              }
            >
              <Trash2 className="size-4" />
            </Button>
          </div>
        ),
      },
    ],
    []
  )

  const mentorColumns = useMemo(
    () => [
      { key: 'user.name', header: 'Mentor Name', sortable: true },
      { key: 'user.email', header: 'Email' },
      {
        key: 'status',
        header: 'Status',
        render: (row) => (
          <Badge
            className={
              row.status === 'ACCEPTED' ? 'bg-green-600' : 'bg-yellow-600'
            }
          >
            {row.status}
          </Badge>
        ),
      },
      {
        key: 'actions',
        header: 'Action',
        render: (row) => (
          <Button size="icon" variant="ghost" className="h-8 w-8 text-red-600">
            <Trash2 className="size-4" />
          </Button>
        ),
      },
    ],
    []
  )

  const quizColumns = useMemo(
    () => [
      { key: 'title', header: 'Quiz Title' },
      {
        key: 'status',
        header: 'Status',
        render: (row) => <Badge variant="outline">{row.status}</Badge>,
      },
      { key: 'duration', header: 'Duration (m)' },
      {
        key: 'actions',
        header: 'Action',
        render: (row) => (
          <div className="flex gap-2">
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8 text-amber-600"
            >
              <Pencil className="size-4" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8 text-red-600"
            >
              <Trash2 className="size-4" />
            </Button>
          </div>
        ),
      },
    ],
    []
  )

  const scheduleColumns = useMemo(
    () => [
      { key: 'title', header: 'Topic' },
      {
        key: 'start_time',
        header: 'Start',
        render: (row) => new Date(row.start_time).toLocaleString(),
      },
      {
        key: 'actions',
        header: 'Action',
        render: (row) => (
          <div className="flex gap-2">
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8 text-amber-600"
            >
              <Pencil className="size-4" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8 text-red-600"
            >
              <Trash2 className="size-4" />
            </Button>
          </div>
        ),
      },
    ],
    []
  )

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

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6 py-10">
      {/* Header: Kembali ke Detail Page */}
      <div className="flex items-center gap-4 border-b pb-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.push(`/backoffice/course`)}
        >
          <ArrowLeft className="size-5" />
        </Button>
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

      {/* Tabs */}
      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full grid-cols-5 bg-gray-100 p-1">
          <TabsTrigger value="general" className="gap-2">
            <Settings className="size-4" /> General
          </TabsTrigger>
          <TabsTrigger value="modules" className="gap-2">
            <BookOpen className="size-4" /> Modules
          </TabsTrigger>
          <TabsTrigger value="mentors" className="gap-2">
            <Users className="size-4" /> Mentors
          </TabsTrigger>
          <TabsTrigger value="quizzes" className="gap-2">
            <FileQuestion className="size-4" /> Quizzes
          </TabsTrigger>
          <TabsTrigger value="schedules" className="gap-2">
            <CalendarDays className="size-4" /> Schedules
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: General (Form Edit) */}
        <TabsContent value="general" className="mt-6">
          <CourseForm
            defaultValues={course}
            mentors={[]}
            onSubmit={(values) =>
              updateCourseMutation.mutate({ id, body: values })
            }
            isLoading={updateCourseMutation.isPending}
          />
        </TabsContent>

        {/* Tab 2: Modules */}
        <TabsContent value="modules" className="mt-6 space-y-4">
          <div className="flex items-center justify-between rounded-lg border bg-white p-4 shadow-sm">
            <div>
              <h3 className="text-lg font-semibold">Course Modules</h3>
              <p className="text-sm text-gray-500">
                Manage learning materials.
              </p>
            </div>
            <Button
              size="sm"
              variant="primary"
              onClick={() =>
                setShowAddModule({
                  status: !showAddModule.status,
                })
              }
            >
              <Plus className="mr-2 size-4" /> Add Module
            </Button>
          </div>
          <div className="rounded-lg border bg-white shadow-sm">
            <BaseTable
              data={course.moduls || []}
              columns={moduleColumns}
              serverSide={false}
              searchFields={['title']}
              onRowAction={() => {}}
            />
          </div>
        </TabsContent>

        {/* Tab 3: Mentors */}
        <TabsContent value="mentors" className="mt-6 space-y-4">
          <div className="flex items-center justify-between rounded-lg border bg-white p-4 shadow-sm">
            <div>
              <h3 className="text-lg font-semibold">Assigned Mentors</h3>
              <p className="text-sm text-gray-500">Manage assigned mentors.</p>
            </div>
            <Button size="sm" variant="primary">
              <Plus className="mr-2 size-4" /> Add Mentor
            </Button>
          </div>
          <div className="rounded-lg border bg-white shadow-sm">
            <BaseTable
              data={course.mentors || []}
              columns={mentorColumns}
              serverSide={false}
              searchFields={['user.name']}
              onRowAction={() => {}}
            />
          </div>
        </TabsContent>

        {/* Tab 4: Quizzes */}
        <TabsContent value="quizzes" className="mt-6 space-y-4">
          <div className="flex items-center justify-between rounded-lg border bg-white p-4 shadow-sm">
            <div>
              <h3 className="text-lg font-semibold">Quizzes</h3>
              <p className="text-sm text-gray-500">Manage quizzes.</p>
            </div>
            <Button size="sm" variant="primary">
              <Plus className="mr-2 size-4" /> Create Quiz
            </Button>
          </div>
          <div className="rounded-lg border bg-white shadow-sm">
            <BaseTable
              data={course.quizzes || []}
              columns={quizColumns}
              serverSide={false}
              searchFields={['title']}
              onRowAction={() => {}}
            />
          </div>
        </TabsContent>

        {/* Tab 5: Schedules */}
        <TabsContent value="schedules" className="mt-6 space-y-4">
          <div className="flex items-center justify-between rounded-lg border bg-white p-4 shadow-sm">
            <div>
              <h3 className="text-lg font-semibold">Live Schedules</h3>
              <p className="text-sm text-gray-500">Manage live sessions.</p>
            </div>
            <Button size="sm" variant="primary">
              <Plus className="mr-2 size-4" /> Add Schedule
            </Button>
          </div>
          <div className="rounded-lg border bg-white shadow-sm">
            <BaseTable
              data={course.schedules || []}
              columns={scheduleColumns}
              serverSide={false}
              searchFields={['title']}
              onRowAction={() => {}}
            />
          </div>
        </TabsContent>
      </Tabs>

      <BackofficeCourseModuleAddDialog
        course={course}
        data={showAddModule}
        onOpenChange={() => {
          setShowAddModule({
            status: !showAddModule.status,
          })
        }}
        onSuccess={() => {}}
      />

      <BackofficeCourseModuleEditDialog
        course={course}
        data={showEditModule}
        onOpenChange={() => {
          setShowEditModule({
            data: !showEditModule.status && row ? row : null,
            status: !showEditModule.status,
          })
        }}
        onSuccess={() => {}}
      />

      <ConfirmDialogDelete
        isOpen={showDelete.status}
        onClose={() => setShowDelete({ status: false, data: null })}
        onConfirm={async () => {
          setIsDeleting(true)
          await showDelete.mutation.mutate({ id: showDelete.data.id })
          setIsDeleting(false)
        }}
        title="Delete Item"
        isLoading={isDeleting || false}
      />
    </div>
  )
}
