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
  getPendingMentorRegistrationsAction,
} from '@/actions/mentor.action'

// ==================================================================
// 1. ORIGINAL BACKOFFICE HOOKS (DO NOT REMOVE/RENAME)
// ==================================================================

// GET LIST MENTOR (BACKOFFICE)
export function useGetAllMentorAdmin({ params }) {
  const { data, isLoading, refetch, isFetching } = useQuery({
    queryKey: ['getAllMentorAdmin', params],
    queryFn: () => getAllMentorAdminAction({ params }),
    refetchOnWindowFocus: false,
    keepPreviousData: true,
  })

  return {
    mentors: data?.data ?? [],
    meta: data?.meta ?? null,
    isLoading: isLoading || isFetching,
    refetch,
  }
}

// GET MENTOR DETAIL BY ID (BACKOFFICE)
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

// UPDATE STATUS MENTOR (BACKOFFICE)
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
        queryClient.invalidateQueries({ queryKey: ['mentors'] })
      } else {
        toast.error(data?.message || 'Failed to update status')
      }
    },
    onError: (err) => {
      toast.error(err.message || 'Error occurred')
    },
  })
}

// DELETE MENTOR (BACKOFFICE)
export function useDeleteMentorMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id }) => deleteMentorAction({ id }),
    onSuccess: (data) => {
      if (data?.code === 200) {
        toast.success('Mentor deleted successfully')
        queryClient.invalidateQueries({ queryKey: ['getAllMentorAdmin'] })
        queryClient.invalidateQueries({ queryKey: ['mentors'] })
      } else {
        toast.error(data?.message || 'Failed to delete mentor')
      }
    },
    onError: (err) => {
      toast.error(err.message || 'Error occurred')
    },
  })
}

// REGISTRATION HOOK
export function useMentorRegistrationMutation({ successAction } = {}) {
  const addMentorRegistrationMutation = useMutation({
    mutationFn: (data) =>
      createMentorRegistrationAction({ body: data.payload }),
    onSuccess: (data) => {
      if (data?.code === 201 || data?.code === 200) {
        if (successAction) successAction()
        toast.success(data?.message || 'Registration successful')
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

// ==================================================================
// 2. FRONTLINER ALIASES & NEW HOOKS

export const useGetMentors = useGetAllMentorAdmin

export const useGetMentor = useGetMentorById

export function useRegisterMentor(onSuccessCallback) {
  const { addMentorRegistrationMutation } = useMentorRegistrationMutation({
    successAction: onSuccessCallback,
  })
  return addMentorRegistrationMutation
}

export function useGetPendingMentors() {
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['mentor-approval-pending'],
    queryFn: getPendingMentorRegistrationsAction,
    select: (res) => res?.data ?? [],
  })

  return {
    pendingMentors: data ?? [],
    isLoading,
    refetch,
  }
}
