import { useMemo } from 'react'
import { useMutation, useQuery } from '@tanstack/react-query'
import { toast } from 'sonner'

import {
  createCourseTransactionAction,
  getAllCourseAction,
  getCourseByIdAction,
} from '@/actions/course.action'

// ⬇ 1. GET ALL COURSE
export function useGetAllCourse({ params }) {
  const { data, isLoading, isPending, refetch } = useQuery({
    queryKey: ['getAllCourse', params],
    queryFn: () => getAllCourseAction({ params }),
    retry: false,
    staleTime: 300000,
    cacheTime: Infinity,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
    onError: (error) => {
      toast.error('Failed to load courses', {
        description: error.message ?? 'Unexpected error occurred!',
      })
    },
  })

  const courses = useMemo(() => {
    return data?.data ?? []
  }, [data])

  return {
    courses,
    isLoading,
    isPending,
    refetch,
  }
}

// ⬇ 2. GET COURSE BY ID
export function useGetCourseById({ courseId }) {
  const { data, isLoading, isPending, refetch } = useQuery({
    queryKey: ['getCourseById', courseId],
    queryFn: () => getCourseByIdAction({ id: courseId }),
    enabled: !!courseId,
    retry: false,
    staleTime: 300000,
    cacheTime: Infinity,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    onError: (error) => {
      toast.error('Failed to load course detail', {
        description: error.message ?? 'Unexpected error occurred!',
      })
    },
  })

  const course = useMemo(() => {
    return data?.code === 200 ? data.data : null
  }, [data])

  return {
    course,
    isLoading,
    isPending,
    refetch,
  }
}

export function useCreateCourseTransactionMutation({ successAction }) {
  const createCourseTransactionMutation = useMutation({
    mutationFn: (data) => createCourseTransactionAction({ body: data.payload }),
    onSuccess: (data) => {
      if (data?.code === 201 || data?.code === 200) {
        successAction()
        return data
      } else {
        toast.error('Course transaction failed to create!', {
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

  return { createCourseTransactionMutation }
}
