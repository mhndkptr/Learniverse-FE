import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
  createQuizAction,
  deleteQuizAction,
  updateQuizAction,
} from '@/actions/quiz.action'

export function useAddQuizMutation({ successAction }) {
  const addQuizMutation = useMutation({
    mutationFn: (data) => createQuizAction({ body: data.payload }),
    onSuccess: (data) => {
      if (data?.code === 201) {
        successAction()
        toast.success(data?.message)
      } else {
        toast.error('Quiz failed to create!', {
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

  return { addQuizMutation }
}

export function useEditQuizMutation({ successAction }) {
  const editQuizMutation = useMutation({
    mutationFn: (data) => updateQuizAction({ id: data.id, body: data.payload }),
    onSuccess: (data) => {
      if (data?.code === 200) {
        successAction()
        toast.success(data?.message)
      } else {
        toast.error('Quiz failed to edit!', {
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

  return { editQuizMutation }
}

export function useDeleteQuizMutation({ successAction }) {
  const deleteQuizMutation = useMutation({
    mutationFn: ({ id }) => deleteQuizAction({ id }),
    onSuccess: (data) => {
      if (data?.code === 200) {
        successAction()
        toast.success(data?.message)
      } else {
        toast.error('Quiz failed to delete!', {
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

  return { deleteQuizMutation }
}
