import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
  createModuleAction,
  deleteModuleAction,
  updateModuleAction,
} from '@/actions/module.action'

export function useAddModuleMutation({ successAction }) {
  const addModuleMutation = useMutation({
    mutationFn: (data) => createModuleAction({ body: data.payload }),
    onSuccess: (data) => {
      if (data?.code === 201) {
        successAction()
        toast.success(data?.message)
      } else {
        toast.error('Module failed to create!', {
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

  return { addModuleMutation }
}

export function useEditModuleMutation({ successAction }) {
  const editModuleMutation = useMutation({
    mutationFn: (data) =>
      updateModuleAction({ id: data.id, body: data.payload }),
    onSuccess: (data) => {
      if (data?.code === 200) {
        successAction()
        toast.success(data?.message)
      } else {
        toast.error('Module failed to edit!', {
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

  return { editModuleMutation }
}

export function useDeleteModuleMutation({ successAction }) {
  const deleteModuleMutation = useMutation({
    mutationFn: ({ id }) => deleteModuleAction({ id }),
    onSuccess: (data) => {
      if (data?.code === 200) {
        successAction()
        toast.success(data?.message)
      } else {
        toast.error('Module failed to delete!', {
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

  return { deleteModuleMutation }
}
