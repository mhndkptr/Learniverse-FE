'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
  createMentorRegistrationAction,
  getAllMentorAdminAction,
  deleteMentorAction,
  getMentorByIdAction,
  approveMentorAction,
  rejectMentorAction,
} from '@/actions/mentor.action'

// --- ADMIN HOOKS ---

// GET LIST MENTOR
export function useGetAllMentorAdmin({ params }) {
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['getAllMentorAdmin', params],
    queryFn: () => getAllMentorAdminAction({ params }),
    refetchOnWindowFocus: false,
  })

  return {
    mentors: data?.data ?? [],
    meta: data?.meta ?? null,
    isLoading,
    refetch,
  }
}

// GET MENTOR DETAIL BY ID
export function useGetMentorById({ id }) {
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['getMentorById', id],
    queryFn: () => getMentorByIdAction({ id }),
    enabled: !!id,
    refetchOnWindowFocus: false,
  })

  return {
    mentor: data?.data ?? null,
    isLoading,
    refetch,
  }
}

// UPDATE STATUS MENTOR (APPROVE/REJECT)
export function useUpdateMentorStatusMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, status, reason }) => {
      if (status === 'ACCEPTED') {
        return approveMentorAction(id)
      } else {
        return rejectMentorAction(id, reason)
      }
    },
    onSuccess: (data) => {
      if (data?.code === 200) {
        toast.success('Mentor status updated successfully')
        queryClient.invalidateQueries({ queryKey: ['getAllMentorAdmin'] })
        queryClient.invalidateQueries({ queryKey: ['getMentorById'] })
      } else {
        toast.error(data?.message || 'Failed to update status')
      }
    },
    onError: (err) => {
      toast.error(err.message || 'Error occurred')
    },
  })
}

// DELETE MENTOR
export function useDeleteMentorMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id }) => deleteMentorAction({ id }),
    onSuccess: (data) => {
      if (data?.code === 200) {
        toast.success('Mentor deleted successfully')
        queryClient.invalidateQueries({ queryKey: ['getAllMentorAdmin'] })
      } else {
        toast.error(data?.message || 'Failed to delete mentor')
      }
    },
    onError: (err) => {
      toast.error(err.message || 'Error occurred')
    },
  })
}

// --- REGISTRATION HOOK ---

export function useMentorRegistrationMutation({ successAction }) {
  const addMentorRegistrationMutation = useMutation({
    mutationFn: (data) =>
      createMentorRegistrationAction({ body: data.payload }),
    onSuccess: (data) => {
      if (data?.code === 201 || data?.code === 200) {
        successAction?.()
        toast.success(data?.message)
      } else {
        toast.error('Registration failed', {
          description: data?.message,
        })
      }
    },
    onError: (error) => {
      toast.error('Something went wrong!')
    },
  })

  return { addMentorRegistrationMutation }
}
