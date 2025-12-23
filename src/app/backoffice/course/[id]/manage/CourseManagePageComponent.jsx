'use client'

import { useRouter } from 'next/navigation'
import { useMemo, useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import request, { handleAxiosError } from '@/utils/baseRequest'
import { getObjValueByPath } from '@/utils/helper'
import {
  useGetCourseByIdAdmin,
  useUpdateCourseAdminMutation,
  useDeleteCourseAdminMutation,
} from '@/hooks/course.hook'
import { useDeleteModuleMutation } from '@/hooks/module.hook'
import { useDeleteQuizMutation } from '@/hooks/quiz.hook'
import {
  useCreateScheduleMutation,
  useUpdateScheduleMutation,
  useDeleteScheduleMutation,
} from '@/hooks/schedule.hook'

import CourseForm from '@/components/core/backoffice/course/CourseForm'
import ConfirmDialogDelete from '@/components/core/backoffice/course/ConfirmDialogDelete'
import BackofficeCourseModuleAddDialog from '@/components/core/backoffice/course/module/BackofficeCourseModuleAddDialog'
import BackofficeCourseModuleEditDialog from '@/components/core/backoffice/course/module/BackofficeCourseModuleEditDialog'
import AddScheduleDialog from '@/components/core/schedule/AddScheduleDialog'

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
  FileSearch,
  CircleMinus,
  ArrowUpDown,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import BaseTable from '@/components/_shared/BaseTable'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'

// API Helper Delete Mentor
const deleteMentorAction = async (id) => {
  try {
    const res = await request.delete(`/mentor/${id}`)
    return res.data
  } catch (err) {
    throw handleAxiosError(err)
  }
}

// --- HELPER FUNCTIONS ---
const formatDateToLocalInput = (dateObj) => {
  const year = dateObj.getFullYear()
  const month = String(dateObj.getMonth() + 1).padStart(2, '0')
  const day = String(dateObj.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

const formatTimeToLocalInput = (dateObj) => {
  const hours = String(dateObj.getHours()).padStart(2, '0')
  const minutes = String(dateObj.getMinutes()).padStart(2, '0')
  return `${hours}:${minutes}`
}

// Helper Sort Data Manual
const sortData = (data, sortConfig) => {
  if (!data) return []
  if (!sortConfig.key) return data

  const sorted = [...data].sort((a, b) => {
    const valA = getObjValueByPath(a, sortConfig.key)
    const valB = getObjValueByPath(b, sortConfig.key)

    if (valA < valB) return sortConfig.direction === 'asc' ? -1 : 1
    if (valA > valB) return sortConfig.direction === 'asc' ? 1 : -1
    return 0
  })
  return sorted
}

const SortDropdown = ({ sortConfig, onSortChange, options }) => {
  return (
    <div className="relative">
      <select
        className="border-input focus:ring-ring h-10 cursor-pointer appearance-none rounded-md border bg-white pr-8 pl-3 text-sm focus:ring-1 focus:outline-none"
        onChange={(e) => {
          const [key, direction] = e.target.value.split(':')
          onSortChange({ key, direction })
        }}
        value={`${sortConfig.key}:${sortConfig.direction}`}
      >
        <option value=":none" disabled>
          Sort By
        </option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      <ArrowUpDown
        size={14}
        className="pointer-events-none absolute top-3 right-2 text-gray-400"
      />
    </div>
  )
}

export default function CourseManagePageComponent({ id }) {
  const router = useRouter()
  const queryClient = useQueryClient()

  // --- STATE UMUM ---
  const [deleteMentorId, setDeleteMentorId] = useState(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isDeleteCourseDialogOpen, setIsDeleteCourseDialogOpen] =
    useState(false)

  // --- STATE SORTING ---
  const [moduleSort, setModuleSort] = useState({
    key: 'created_at',
    direction: 'desc',
  })
  const [mentorSort, setMentorSort] = useState({
    key: 'created_at',
    direction: 'desc',
  })
  const [quizSort, setQuizSort] = useState({
    key: 'created_at',
    direction: 'desc',
  })
  const [scheduleSort, setScheduleSort] = useState({
    key: 'created_at',
    direction: 'desc',
  })

  // --- STATE SCHEDULE ---
  const [showAddSchedule, setShowAddSchedule] = useState(false)
  const [editingSchedule, setEditingSchedule] = useState(null)
  const [deleteScheduleId, setDeleteScheduleId] = useState(null)

  // --- DATA FETCHING ---
  const { course, isLoading, refetch } = useGetCourseByIdAdmin({ courseId: id })

  // --- PROCESSED DATA (SORTED) ---
  const processedModules = useMemo(
    () => sortData(course?.moduls || [], moduleSort),
    [course?.moduls, moduleSort]
  )
  const processedMentors = useMemo(
    () => sortData(course?.mentors || [], mentorSort),
    [course?.mentors, mentorSort]
  )
  const processedQuizzes = useMemo(
    () => sortData(course?.quizzes || [], quizSort),
    [course?.quizzes, quizSort]
  )
  const processedSchedules = useMemo(
    () => sortData(course?.schedules || [], scheduleSort),
    [course?.schedules, scheduleSort]
  )

  // --- MUTATIONS ---
  const updateCourseMutation = useUpdateCourseAdminMutation({
    onSuccess: () => refetch(),
  })

  const { mutate: deleteCourse, isPending: isDeletingCourse } =
    useDeleteCourseAdminMutation({
      onSuccess: () => {
        router.push('/backoffice/course')
      },
    })

  const { deleteModuleMutation } = useDeleteModuleMutation({
    successAction: () => {
      setShowDelete({ status: false, data: null, mutation: null })
      refetch()
    },
  })

  const { deleteQuizMutation } = useDeleteQuizMutation({
    successAction: () => {
      setShowDelete({ status: false, data: null, mutation: null })
      refetch()
    },
  })

  const { mutation: createScheduleMutation } = useCreateScheduleMutation({
    successAction: () => {
      setShowAddSchedule(false)
      refetch()
    },
  })

  const { mutation: updateScheduleMutation } = useUpdateScheduleMutation({
    successAction: () => {
      setShowAddSchedule(false)
      setEditingSchedule(null)
      refetch()
    },
  })

  const { mutation: deleteScheduleMutation } = useDeleteScheduleMutation()

  const [showDelete, setShowDelete] = useState({
    status: false,
    data: null,
    mutation: null,
  })
  const [isDeleting, setIsDeleting] = useState(false)
  const [showAddModule, setShowAddModule] = useState({ status: false })
  const [showEditModule, setShowEditModule] = useState({
    status: false,
    data: null,
  })

  // Mutation Delete Mentor
  const deleteMentorMutation = useMutation({
    mutationFn: deleteMentorAction,
    onSuccess: () => {
      toast.success('Mentor removed successfully')
      queryClient.invalidateQueries(['getCourseByIdAdmin', id])
      refetch()
      setIsDeleteDialogOpen(false)
      setDeleteMentorId(null)
    },
    onError: (err) => {
      toast.error(err.message || 'Failed to remove mentor')
    },
  })

  // --- HANDLERS ---
  const handleReviewClick = (mentorId) => {
    router.push(`/backoffice/course/${id}/manage/mentor/${mentorId}`)
  }

  const handleTriggerDeleteMentor = (mentorId) => {
    setDeleteMentorId(mentorId)
    setIsDeleteDialogOpen(true)
  }

  const handleConfirmDeleteMentor = () => {
    if (deleteMentorId) {
      deleteMentorMutation.mutate(deleteMentorId)
    }
  }

  const handleTriggerDeleteCourse = () => {
    setIsDeleteCourseDialogOpen(true)
  }

  const handleConfirmDeleteCourse = () => {
    deleteCourse(id)
  }

  const handleSaveSchedule = (data) => {
    const startDateObj = new Date(`${data.date}T${data.startTime}`)
    const endDateObj = new Date(`${data.date}T${data.endTime}`)

    const payload = {
      title: data.title,
      description: '',
      course_id: data.courseId,
      start_time: startDateObj.toISOString(),
      end_time: endDateObj.toISOString(),
    }

    if (data.id) {
      updateScheduleMutation.mutate({ id: data.id, payload })
    } else {
      createScheduleMutation.mutate(payload)
    }
  }

  const handleEditSchedule = (row) => {
    const startDateObj = new Date(row.start_time)
    const endDateObj = new Date(row.end_time)

    const dateStr = formatDateToLocalInput(startDateObj)
    const startTimeStr = formatTimeToLocalInput(startDateObj)
    const endTimeStr = formatTimeToLocalInput(endDateObj)

    setEditingSchedule({
      id: row.id,
      title: row.title,
      courseId: row.course_id,
      date: dateStr,
      startTime: startTimeStr,
      endTime: endTimeStr,
    })
    setShowAddSchedule(true)
  }

  const handleDeleteSchedule = async () => {
    if (deleteScheduleId) {
      setIsDeleting(true)
      await deleteScheduleMutation.mutateAsync({ id: deleteScheduleId })
      refetch()
      setIsDeleting(false)
      setDeleteScheduleId(null)
      toast.success('Schedule deleted')
    }
  }

  // --- KOLOM TABEL  ---
  const moduleColumns = useMemo(
    () => [
      { key: 'title', header: 'Module Title' },
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
      { key: 'user.name', header: 'Mentor Name' },
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

          const statusLabel = (row.status || 'UNKNOWN').replace('_', ' ')

          return (
            <Badge className={`${colorClass} text-white`}>{statusLabel}</Badge>
          )
        },
      },
      {
        key: 'actions',
        header: 'Action',
        render: (row) => {
          if (row.status === 'ON_REVIEW') {
            return (
              <Button
                size="sm"
                className="h-8 bg-[#0E1B50] text-white hover:bg-blue-900"
                onClick={() => handleReviewClick(row.id)}
                title="Review Application"
              >
                <FileSearch className="mr-2 size-3" /> Review
              </Button>
            )
          }
          return (
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8 text-gray-400 hover:bg-red-50 hover:text-red-600"
              title="Unenroll this mentor"
              onClick={() => handleTriggerDeleteMentor(row.id)}
            >
              <CircleMinus className="size-5" />
            </Button>
          )
        },
      },
    ],
    []
  )

  const quizColumns = useMemo(
    () => [
      {
        key: 'title',
        header: 'Quiz Title',
        className: 'w-[50%] min-w-[300px]',
      },
      {
        key: 'status',
        header: 'Status',
        className: 'w-[100px]',
        render: (row) => <Badge variant="outline">{row.status}</Badge>,
      },
      {
        key: 'duration',
        header: 'Duration (m)',
        className: 'w-[150px] whitespace-nowrap',
      },
      {
        key: 'actions',
        header: 'Action',
        className: 'w-[100px]',
        render: (row) => (
          <div className="flex gap-2">
            <Link href={`/backoffice/course/${id}/manage/quiz/${row.id}/edit`}>
              <Button
                size="icon"
                variant="ghost"
                className="h-8 w-8 text-amber-600"
              >
                <Pencil className="size-4" />
              </Button>
            </Link>
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8 text-red-600"
              onClick={() =>
                setShowDelete({
                  status: true,
                  data: row,
                  mutation: deleteQuizMutation,
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

  const scheduleColumns = useMemo(
    () => [
      { key: 'title', header: 'Topic' },
      {
        key: 'date',
        header: 'Date',
        render: (row) =>
          new Date(row.start_time).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          }),
      },
      {
        key: 'start_time',
        header: 'Start Time',
        render: (row) =>
          new Date(row.start_time).toLocaleTimeString('id-ID', {
            hour: '2-digit',
            minute: '2-digit',
          }),
      },
      {
        key: 'end_time',
        header: 'End Time',
        render: (row) =>
          new Date(row.end_time).toLocaleTimeString('id-ID', {
            hour: '2-digit',
            minute: '2-digit',
          }),
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
              onClick={() => handleEditSchedule(row)}
            >
              <Pencil className="size-4" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8 text-red-600"
              onClick={() => setDeleteScheduleId(row.id)}
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
      {/* Header */}
      <div className="flex items-center gap-4 border-b pb-4">
        <Link href={`/backoffice/course`}>
          <Button variant="ghost" size="icon">
            <ArrowLeft className="size-5" />
          </Button>
        </Link>
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

        <TabsContent value="general" className="mt-6">
          <CourseForm
            defaultValues={course}
            onSubmit={(values) =>
              updateCourseMutation.mutate({ id, body: values })
            }
            isLoading={updateCourseMutation.isPending}
            onDelete={handleTriggerDeleteCourse}
          />
        </TabsContent>

        <TabsContent value="modules" className="mt-6 space-y-4">
          <div className="flex items-center justify-between rounded-lg border bg-white p-4 shadow-sm">
            <div>
              <h3 className="text-lg font-semibold">Course Modules</h3>
              <p className="text-sm text-gray-500">
                Manage learning materials.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <SortDropdown
                sortConfig={moduleSort}
                onSortChange={setModuleSort}
                options={[
                  { value: 'title:asc', label: 'Title (A-Z)' },
                  { value: 'title:desc', label: 'Title (Z-A)' },
                  { value: 'created_at:desc', label: 'Newest' },
                  { value: 'created_at:asc', label: 'Oldest' },
                ]}
              />
              <Button
                size="sm"
                variant="primary"
                onClick={() => setShowAddModule({ status: true })}
              >
                <Plus className="mr-2 size-4" /> Add Module
              </Button>
            </div>
          </div>
          <div className="rounded-lg border bg-white shadow-sm">
            <BaseTable
              data={processedModules}
              columns={moduleColumns}
              serverSide={true}
              searchFields={['title']}
              onRowAction={() => {}}
              sortConfig={moduleSort}
              onSortChange={setModuleSort}
            />
          </div>
        </TabsContent>

        <TabsContent value="mentors" className="mt-6 space-y-4">
          <div className="flex items-center justify-between rounded-lg border bg-white p-4 shadow-sm">
            <div>
              <h3 className="text-lg font-semibold">Assigned Mentors</h3>
              <p className="text-sm text-gray-500">
                Manage mentor applications and approvals.
              </p>
            </div>
            <SortDropdown
              sortConfig={mentorSort}
              onSortChange={setMentorSort}
              options={[
                { value: 'user.name:asc', label: 'Name (A-Z)' },
                { value: 'user.name:desc', label: 'Name (Z-A)' },
                { value: 'status:asc', label: 'Status' },
                { value: 'created_at:desc', label: 'Newest' },
                { value: 'created_at:asc', label: 'Oldest' },
              ]}
            />
          </div>
          <div className="rounded-lg border bg-white shadow-sm">
            <BaseTable
              data={processedMentors}
              columns={mentorColumns}
              serverSide={true}
              searchFields={['user.name', 'user.email']}
              onRowAction={() => {}}
              sortConfig={mentorSort}
              onSortChange={setMentorSort}
            />
          </div>
        </TabsContent>

        <TabsContent value="quizzes" className="mt-6 space-y-4">
          <div className="flex items-center justify-between rounded-lg border bg-white p-4 shadow-sm">
            <div>
              <h3 className="text-lg font-semibold">Quizzes</h3>
              <p className="text-sm text-gray-500">Manage quizzes.</p>
            </div>
            <div className="flex items-center gap-3">
              <SortDropdown
                sortConfig={quizSort}
                onSortChange={setQuizSort}
                options={[
                  { value: 'title:asc', label: 'Title (A-Z)' },
                  { value: 'title:desc', label: 'Title (Z-A)' },
                  { value: 'status:asc', label: 'Status' },
                  { value: 'duration:asc', label: 'Duration' },
                  { value: 'created_at:desc', label: 'Newest' },
                  { value: 'created_at:asc', label: 'Oldest' },
                ]}
              />
              <Link href={`/backoffice/course/${id}/manage/quiz/create`}>
                <Button size="sm" variant="primary">
                  <Plus className="mr-2 size-4" /> Create Quiz
                </Button>
              </Link>
            </div>
          </div>
          <div className="rounded-lg border bg-white shadow-sm">
            <BaseTable
              data={processedQuizzes}
              columns={quizColumns}
              serverSide={true}
              searchFields={['title']}
              onRowAction={() => {}}
              sortConfig={quizSort}
              onSortChange={setQuizSort}
            />
          </div>
        </TabsContent>

        <TabsContent value="schedules" className="mt-6 space-y-4">
          <div className="flex items-center justify-between rounded-lg border bg-white p-4 shadow-sm">
            <div>
              <h3 className="text-lg font-semibold">Live Schedules</h3>
              <p className="text-sm text-gray-500">Manage live sessions.</p>
            </div>
            <div className="flex items-center gap-3">
              <SortDropdown
                sortConfig={scheduleSort}
                onSortChange={setScheduleSort}
                options={[
                  { value: 'start_time:asc', label: 'Earliest' },
                  { value: 'start_time:desc', label: 'Latest' },
                  { value: 'title:asc', label: 'Topic (A-Z)' },
                  { value: 'created_at:desc', label: 'Newest Created' },
                  { value: 'created_at:asc', label: 'Oldest Created' },
                ]}
              />
              <Button
                size="sm"
                variant="primary"
                onClick={() => {
                  setEditingSchedule(null)
                  setShowAddSchedule(true)
                }}
              >
                <Plus className="mr-2 size-4" /> Add Schedule
              </Button>
            </div>
          </div>
          <div className="rounded-lg border bg-white shadow-sm">
            <BaseTable
              data={processedSchedules}
              columns={scheduleColumns}
              serverSide={true}
              searchFields={['title']}
              onRowAction={() => {}}
              sortConfig={scheduleSort}
              onSortChange={setScheduleSort}
            />
          </div>
        </TabsContent>
      </Tabs>

      {/* --- DIALOGS --- */}

      <BackofficeCourseModuleAddDialog
        course={course}
        data={showAddModule}
        onOpenChange={() => setShowAddModule({ status: false })}
        onSuccess={() => refetch()}
      />

      <BackofficeCourseModuleEditDialog
        course={course}
        data={showEditModule}
        onOpenChange={() => {
          setShowEditModule({
            data:
              !showEditModule.status && showEditModule.data
                ? showEditModule.data
                : null,
            status: !showEditModule.status,
          })
        }}
        onSuccess={() => {}}
      />

      <AddScheduleDialog
        open={showAddSchedule}
        onOpenChange={setShowAddSchedule}
        initialData={editingSchedule}
        onSave={handleSaveSchedule}
        userCourses={[{ id: course.id, title: course.title }]}
      />

      {/* 2. Generic Delete Dialog (For Module/Quiz) */}
      <ConfirmDialogDelete
        isOpen={showDelete.status}
        onClose={() =>
          setShowDelete({ status: false, data: null, mutation: null })
        }
        onConfirm={async () => {
          setIsDeleting(true)
          await showDelete.mutation.mutate({ id: showDelete?.data?.id })
          setIsDeleting(false)
          refetch()
        }}
        title="Delete Item"
        isLoading={isDeleting}
      />

      {/* 3. Mentor Delete Dialog */}
      <ConfirmDialogDelete
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleConfirmDeleteMentor}
        title="Remove Mentor"
        description="Are you sure you want to remove this mentor? This action cannot be undone."
        isLoading={deleteMentorMutation.isPending}
        confirmText="Remove"
        variant="danger"
      />

      {/* 4. Course Delete Dialog */}
      <ConfirmDialogDelete
        isOpen={isDeleteCourseDialogOpen}
        onClose={() => setIsDeleteCourseDialogOpen(false)}
        onConfirm={handleConfirmDeleteCourse}
        title="Delete Entire Course"
        description="Are you sure you want to delete this course permanently? All modules, quizzes, and enrollments will be affected."
        isLoading={isDeletingCourse}
        confirmText="Delete Course"
        variant="danger"
      />

      {/* 5. Schedule Delete Dialog */}
      <ConfirmDialogDelete
        isOpen={!!deleteScheduleId}
        onClose={() => setDeleteScheduleId(null)}
        onConfirm={handleDeleteSchedule}
        title="Delete Schedule"
        description="Are you sure you want to delete this schedule? This action cannot be undone."
        isLoading={isDeleting}
        confirmText="Delete Schedule"
        variant="danger"
      />
    </div>
  )
}
