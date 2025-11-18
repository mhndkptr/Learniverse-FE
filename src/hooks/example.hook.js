import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useMemo } from 'react'
import { toast } from 'sonner'
import {
  getAllExampleAction,
  getExampleByIdAction,
  createExampleAction,
  updateExampleAction,
  deleteExampleAction,
} from '@/actions/example.action'

export function useGetAllExample({ params }) {
  const { data, isLoading, isPending, refetch } = useQuery({
    queryKey: ['getExamples', params],
    queryFn: () => getAllExampleAction({ params }),
    retry: false,
    staleTime: 300000, // 5 menit
    cacheTime: Infinity, // Cache tidak akan dihapus
    refetchOnMount: true, // Tidak refetch saat komponen di-mount ulang
    refetchOnWindowFocus: false, // Tidak refetch saat fokus kembali ke tab
    onError: (error) => {
      toast.error('Something went wrong!', {
        description: error.message
          ? error.message
          : 'Unexpected error occurred!',
      })
    },
  })

  const examples = useMemo(() => {
    return data?.code === 200 ? data.data : []
  }, [data])

  return {
    examples,
    isLoading,
    isPending,
    refetch,
  }
}

export function useGetExampleById({ exampleId }) {
  const { data, isLoading, isPending, refetch } = useQuery({
    queryKey: ['getExampleById', exampleId],
    queryFn: () => getExampleByIdAction({ id: exampleId }),
    enabled: !!exampleId,
    retry: false,
    staleTime: 300000, // 5 menit
    cacheTime: Infinity, // Cache tidak akan dihapus
    refetchOnMount: false, // Tidak refetch saat komponen di-mount ulang
    refetchOnWindowFocus: false, // Tidak refetch saat fokus kembali ke tab
    onError: (error) => {
      toast.error('Something went wrong!', {
        description: error.message
          ? error.message
          : 'Unexpected error occurred!',
      })
    },
  })

  const example = useMemo(() => {
    return data?.code === 200 ? data.data : null
  }, [data])

  return {
    example,
    isLoading,
    isPending,
    refetch,
  }
}

export function useAddExampleMutation({ successAction }) {
  const queryClient = useQueryClient()
  const addExampleMutation = useMutation({
    mutationFn: (data) => createExampleAction({ body: data.payload }),
    onSuccess: (data) => {
      if (data?.code === 201) {
        successAction()
        toast.success(data?.message)
        queryClient.invalidateQueries({ queryKey: ['getAllExamples'] })
      } else {
        toast.error('Example failed to create!', {
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

  return { addExampleMutation }
}

export function useEditExampleMutation({ successAction }) {
  const queryClient = useQueryClient()
  const editExampleMutation = useMutation({
    mutationFn: (data) =>
      updateExampleAction({ body: data.payload, id: data.exampleId }),
    onSuccess: (data) => {
      if (data?.code === 200) {
        successAction()
        toast.success(data?.message)
        queryClient.invalidateQueries({ queryKey: ['getAllExamples'] })
      } else {
        toast.error('Example failed to update!', {
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

  return { editExampleMutation }
}

export function useDeleteExampleMutation({ successAction }) {
  const queryClient = useQueryClient()
  const deleteExampleMutation = useMutation({
    mutationFn: ({ exampleId }) => deleteExampleAction({ id: exampleId }),
    onSuccess: (data) => {
      if (data?.code === 200) {
        successAction()
        toast.success(data?.message)
        queryClient.invalidateQueries({ queryKey: ['getAllExamples'] })
      } else {
        toast.error('Example failed to delete!', {
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

  return { deleteExampleMutation }
}
