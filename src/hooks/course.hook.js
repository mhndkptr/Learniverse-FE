import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { toast } from 'sonner'

import {
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
  console.log(courseId)
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
console.log(data)
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
