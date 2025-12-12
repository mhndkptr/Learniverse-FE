import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import {
  getPendingMentorRegistrationsAction,
  approveMentorAction,
  rejectMentorAction,
} from '@/actions/mentor.action'

export function useMentorApprovalList() {
  return useQuery({
    queryKey: ['mentor-approval-pending'],
    queryFn: getPendingMentorRegistrationsAction,
    select: (res) => res?.data ?? [],
  })
}

export function useApproveMentor() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id) => approveMentorAction(id),
    onSuccess: (data) => {
      if (data?.code === 200) {
        toast.success('Mentor approved!')
        queryClient.invalidateQueries(['mentor-approval-pending'])
      } else {
        toast.error('Failed to approve mentor', {
          description: data?.message,
        })
      }
    },
    onError: (err) => {
      toast.error('Something went wrong!', { description: err.message })
    },
  })
}

export function useRejectMentor() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, reason }) => rejectMentorAction(id, reason),
    onSuccess: (data) => {
      if (data?.code === 200) {
        toast.success('Mentor rejected.')
        queryClient.invalidateQueries(['mentor-approval-pending'])
      } else {
        toast.error('Failed to reject mentor', {
          description: data?.message,
        })
      }
    },
    onError: (err) => {
      toast.error('Something went wrong!', { description: err.message })
    },
  })
}
