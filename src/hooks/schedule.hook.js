import { useMemo } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import {
  getAllScheduleAction,
  createScheduleAction,
  updateScheduleAction,
  deleteScheduleAction,
} from '@/actions/schedule.action'

// ✅ GET ALL SCHEDULE
export function useGetAllSchedule({ params, enabled = true }) {
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['getAllSchedule', params],
    queryFn: () => getAllScheduleAction({ params }),
    retry: false,
    enabled,
  })

  // convert data dari backend → format kalender UI kamu
  const schedules = useMemo(() => {
    if (!data || data.code !== 200) return {}

    const result = {}
    const filterCourseId =
      params?.filterCourseId || params?.filter?.course_id || null

    data.data.forEach((sch) => {
      if (filterCourseId && sch.course_id !== filterCourseId) return

      const startDate = new Date(sch.start_time)
      const endDate = new Date(sch.end_time)

      // gunakan tanggal lokal (format YYYY-MM-DD) untuk key kalender
      const date = startDate.toLocaleDateString('en-CA')

      const start = startDate.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      })

      const end = endDate.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      })

      if (!result[date]) result[date] = []

      result[date].push({
        id: sch.id,
        title: sch.title,
        course: sch.course?.title ?? '-',
        courseId: sch.course_id,
        startTime: start,
        endTime: end,
        raw: sch,
      })
    })

    return result
  }, [data])

  return {
    schedules,
    isLoading,
    refetch,
  }
}

// ✅ CREATE
export function useCreateScheduleMutation({ successAction }) {
  const qc = useQueryClient()
  const mutation = useMutation({
    mutationFn: (payload) => createScheduleAction({ body: payload }),
    onSuccess: (data) => {
      if (data?.code === 201) {
        toast.success('Schedule created')
        qc.invalidateQueries({ queryKey: ['getAllSchedule'] })
        successAction?.()
      } else {
        toast.error(data?.message ?? 'Failed to create')
      }
    },
  })

  return { mutation }
}

// ✅ UPDATE
export function useUpdateScheduleMutation({ successAction }) {
  const qc = useQueryClient()
  const mutation = useMutation({
    mutationFn: ({ id, payload }) =>
      updateScheduleAction({ id, body: payload }),
    onSuccess: (data) => {
      if (data?.code === 200) {
        toast.success('Schedule updated')
        qc.invalidateQueries({ queryKey: ['getAllSchedule'] })
        successAction?.()
      } else {
        toast.error(data?.message ?? 'Failed to update')
      }
    },
  })

  return { mutation }
}

// ✅ DELETE
export function useDeleteScheduleMutation() {
  const qc = useQueryClient()
  const mutation = useMutation({
    mutationFn: ({ id }) => deleteScheduleAction({ id }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['getAllSchedule'] })
    },
  })

  return { mutation }
}
