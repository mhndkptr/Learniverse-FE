import { useMutation, useQuery } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
  getQuizByIdAction,
  createQuizAction,
  deleteQuizAction,
  updateQuizAction,
  createQuizQuestionAction,
  updateQuizQuestionAction,
  deleteQuizQuestionAction,
  getAllActiveQuizAction,
  getAllQuizAction,
  createAttemptQuizAction,
} from '@/actions/quiz.action'
import { useMemo } from 'react'

export function useGetAllQuiz({ params }) {
  const { data, isLoading, isPending, refetch } = useQuery({
    queryKey: ['getAllQuiz', params],
    queryFn: () => getAllQuizAction({ params }),
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

  const quizzes = useMemo(() => {
    return data?.code === 200 ? data.data : []
  }, [data])

  return {
    quizzes,
    isLoading,
    isPending,
    refetch,
  }
}

export function useGetAllActiveQuiz() {
  const { data, isLoading, isPending, refetch } = useQuery({
    queryKey: ['getAllActiveQuiz'],
    queryFn: () => getAllActiveQuizAction(),
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

  const activeQuizzes = useMemo(() => {
    return data?.code === 200 ? data.data : []
  }, [data])

  return {
    activeQuizzes,
    isLoading,
    isPending,
    refetch,
  }
}

export function useGetQuizById({ quizId }) {
  const { data, isLoading, isPending, refetch } = useQuery({
    queryKey: ['getQuizById', quizId],
    queryFn: () => getQuizByIdAction({ id: quizId }),
    enabled: !!quizId,
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

  const quiz = useMemo(() => {
    return data?.code === 200 ? data.data : null
  }, [data])

  return {
    quiz,
    isLoading,
    isPending,
    refetch,
  }
}

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

export function useAddQuizQuestionMutation({ successAction }) {
  const addQuizQuestionMutation = useMutation({
    mutationFn: (data) => createQuizQuestionAction({ body: data.payload }),
    onSuccess: (data) => {
      if (data?.code === 201) {
        successAction()
        toast.success(data?.message)
      } else {
        toast.error('Quiz question failed to create!', {
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

  return { addQuizQuestionMutation }
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

export function useEditQuizQuestionMutation({ successAction }) {
  const editQuizQuestionMutation = useMutation({
    mutationFn: (data) =>
      updateQuizQuestionAction({ id: data.id, body: data.payload }),
    onSuccess: (data) => {
      if (data?.code === 200) {
        successAction()
        toast.success(data?.message)
      } else {
        toast.error('Quiz question failed to edit!', {
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

  return { editQuizQuestionMutation }
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

export function useDeleteQuizQuestionMutation({ successAction }) {
  const deleteQuizQuestionMutation = useMutation({
    mutationFn: ({ id }) => deleteQuizQuestionAction({ id }),
    onSuccess: (data) => {
      if (data?.code === 200) {
        successAction()
        toast.success(data?.message)
      } else {
        toast.error('Quiz question failed to delete!', {
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

  return { deleteQuizQuestionMutation }
}

export function useAttemptQuizMutation({ successAction }) {
  const createQuizAttemptMutation = useMutation({
    mutationFn: (data) => createAttemptQuizAction({ body: data.payload }),
    onSuccess: (data) => {
      if (data?.code === 201) {
        successAction()
        toast.success(data?.message)
      } else {
        toast.error('Quiz attempt failed to create!', {
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

  return { createQuizAttemptMutation }
}
