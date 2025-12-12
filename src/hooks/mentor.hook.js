import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useMemo } from 'react'
import { toast } from 'sonner'
import { createMentorRegistrationAction } from '@/actions/mentor.action'

export function useMentorRegistrationMutation({ successAction }) {
  const addMentorRegistrationMutation = useMutation({
    mutationFn: (data) =>
      createMentorRegistrationAction({ body: data.payload }),
    onSuccess: (data) => {
      if (data?.code === 201) {
        successAction()
        toast.success(data?.message)
      } else {
        toast.error('Mentor Registration failed to create!', {
          description: data?.message
            ? data.message
            : 'Unexpected error occurred',
        })
      }
    },
    onError: (error) => {
      toast.error('Something went wrong!', {
        description: error?.message
          ? error.message
          : 'Unexpected error occurred',
      })
    },
  })

  return { addMentorRegistrationMutation }
}
