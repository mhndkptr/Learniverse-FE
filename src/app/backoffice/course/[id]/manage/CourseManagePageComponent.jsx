'use client'

import { useRouter } from 'next/navigation'
import { useMemo, useState } from 'react' // Tambahkan useState
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import request, { handleAxiosError } from '@/utils/baseRequest'
import {
  useGetCourseByIdAdmin,
  useUpdateCourseAdminMutation,
} from '@/hooks/course.hook'
import CourseForm from '@/components/core/backoffice/course/CourseForm'
// Import Component Confirm Dialog yang sudah ada
import ConfirmDialogDelete from '@/components/core/backoffice/course/ConfirmDialogDelete'

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
  Check,
  X,
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

// --- API HELPER UNTUK MENTOR ---
const updateMentorStatusAction = async ({ id, status }) => {
  try {
    const res = await request.patch(`/mentor/${id}`, { status })
    return res.data
  } catch (err) {
    throw handleAxiosError(err)
  }
}

// API Helper Delete Mentor
const deleteMentorAction = async (id) => {
  try {
    const res = await request.delete(`/mentor/${id}`)
    return res.data
  } catch (err) {
    throw handleAxiosError(err)
  }
}

export default function CourseManagePageComponent({ id }) {
  const router = useRouter()
  const queryClient = useQueryClient()

  // State untuk Dialog Delete Mentor
  const [deleteMentorId, setDeleteMentorId] = useState(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  // --- DATA FETCHING ---
  const { course, isLoading, refetch } = useGetCourseByIdAdmin({ courseId: id })

  // --- MUTATIONS ---
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

  // Mutation untuk Approve/Reject Mentor
  const mentorStatusMutation = useMutation({
    mutationFn: updateMentorStatusAction,
    onSuccess: (_, variables) => {
      toast.success(
        `Mentor ${variables.status === 'ACCEPTED' ? 'accepted' : 'rejected'} successfully`
      )
      queryClient.invalidateQueries(['getCourseByIdAdmin', id])
      refetch()
    },
    onError: (err) => {
      toast.error(err.message || 'Failed to update mentor status')
    },
  })

  // Mutation untuk Delete Mentor
  const deleteMentorMutation = useMutation({
    mutationFn: deleteMentorAction,
    onSuccess: () => {
      toast.success('Mentor removed successfully')
      queryClient.invalidateQueries(['getCourseByIdAdmin', id])
      refetch()
      // Tutup dialog setelah sukses
      setIsDeleteDialogOpen(false)
      setDeleteMentorId(null)
    },
    onError: (err) => {
      toast.error(err.message || 'Failed to remove mentor')
    },
  })

  // Handler update status
  const handleMentorAction = (mentorId, newStatus) => {
    mentorStatusMutation.mutate({ id: mentorId, status: newStatus })
  }

  // Handler Memicu Dialog Delete (Bukan langsung delete)
  const handleTriggerDelete = (mentorId) => {
    setDeleteMentorId(mentorId)
    setIsDeleteDialogOpen(true)
  }

  // Handler Eksekusi Delete (Dipanggil dari Dialog)
  const handleConfirmDelete = () => {
    if (deleteMentorId) {
      deleteMentorMutation.mutate(deleteMentorId)
    }
  }

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
        render: (row) => {
          let colorClass = 'bg-gray-500'
          if (row.status === 'ACCEPTED')
            colorClass = 'bg-green-600 hover:bg-green-700'
          if (row.status === 'REJECTED')
            colorClass = 'bg-red-600 hover:bg-red-700'
          if (row.status === 'ON_REVIEW')
            colorClass = 'bg-yellow-600 hover:bg-yellow-700'

          return (
            <Badge className={`${colorClass} text-white`}>
              {row.status.replace('_', ' ')}
            </Badge>
          )
        },
      },
      {
        key: 'actions',
        header: 'Action',
        render: (row) => {
          // Jika status ON_REVIEW, tampilkan tombol Accept & Decline
          if (row.status === 'ON_REVIEW') {
            return (
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  className="h-8 bg-green-600 text-white hover:bg-green-700"
                  onClick={() => handleMentorAction(row.id, 'ACCEPTED')}
                  disabled={mentorStatusMutation.isPending}
                  title="Accept Mentor"
                >
                  <Check className="mr-1 size-3" /> Accept
                </Button>
                <Button
                  size="sm"
                  className="h-8 bg-red-600 text-white hover:bg-red-700"
                  onClick={() => handleMentorAction(row.id, 'REJECTED')}
                  disabled={mentorStatusMutation.isPending}
                  title="Decline Mentor"
                >
                  <X className="mr-1 size-3" /> Decline
                </Button>
              </div>
            )
          }

          // Tombol DELETE membuka Dialog
          return (
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8 text-gray-400 hover:text-red-600"
              title="Remove Mentor"
              onClick={() => handleTriggerDelete(row.id)}
            >
              <Trash2 className="size-4" />
            </Button>
          )
        },
      },
    ],
    [mentorStatusMutation.isPending]
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
              <p className="text-sm text-gray-500">
                Manage mentor applications and approvals.
              </p>
            </div>
          </div>
          <div className="rounded-lg border bg-white shadow-sm">
            <BaseTable
              data={course.mentors || []}
              columns={mentorColumns}
              serverSide={false}
              searchFields={['user.name', 'user.email']}
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
