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
export function useGetAllSchedule({ params }) {
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['getAllSchedule', params],
    queryFn: () => getAllScheduleAction({ params }),
    retry: false,
  })

  // convert data dari backend → format kalender UI kamu
  const schedules = useMemo(() => {
    if (!data || data.code !== 200) return {}

    const result = {}

    data.data.forEach((sch) => {
      const date = sch.start_time.split('T')[0]
      const start = sch.start_time.substring(11, 16)
      const end = sch.end_time.substring(11, 16)

      if (!result[date]) result[date] = []

      result[date].push({
        id: sch.id,
        title: sch.title,
        course: sch.course?.title ?? '-',
        startTime: start,
        endTime: end,
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
