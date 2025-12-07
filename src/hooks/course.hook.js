'use client'

import { useMemo } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import request, { handleAxiosError } from '@/utils/baseRequest'

import {
  createCourseTransactionAction,
  getAllCourseAction,
  getCourseByIdAction,
  getAllCourseAdminAction,
  getCourseByIdAdminAction,
  deleteCourseAction,
} from '@/actions/course.action'

/* =========================================================
   HELPER: BUILD FORM DATA
   ========================================================= */
const buildCourseFormData = (data) => {
  const form = new FormData()

  if (data.title) form.append('title', data.title)
  if (data.code) form.append('code', data.code)

  if (data.price !== undefined && data.price !== null) {
    form.append('price', data.price)
  }

  // Allow empty string for description/content (resetting value)
  if (data.description !== undefined)
    form.append('description', data.description)
  if (data.content !== undefined) form.append('content', data.content)

  if (data.is_open_registration_member !== undefined) {
    form.append(
      'is_open_registration_member',
      String(data.is_open_registration_member)
    )
  }

  if (data.is_open_registration_mentor !== undefined) {
    form.append(
      'is_open_registration_mentor',
      String(data.is_open_registration_mentor)
    )
  }

  // Handle Gambar
  if (data.cover instanceof File) {
    form.append('image_cover', data.cover)
  }

  return form
}

/* =========================================================
   FRONTLINER HOOKS (PUBLIC)
   ========================================================= */

export function useGetAllCourse({ params }) {
  const { data, isLoading, isPending, refetch } = useQuery({
    queryKey: ['getAllCourse', params],
    queryFn: () => getAllCourseAction({ params }),
    retry: false,
    staleTime: 300000,
    refetchOnWindowFocus: false,
    onError: (error) => toast.error(error.message ?? 'Failed to load courses'),
  })

  const courses = useMemo(() => data?.data ?? [], [data])
  return { courses, isLoading, isPending, refetch }
}

export function useGetCourseById({ courseId }) {
  const { data, isLoading, isPending, refetch } = useQuery({
    queryKey: ['getCourseById', courseId],
    queryFn: () => getCourseByIdAction({ id: courseId }),
    enabled: !!courseId,
    retry: false,
    refetchOnWindowFocus: false,
    onError: (error) => toast.error(error.message ?? 'Failed to load details'),
  })

  const course = useMemo(() => (data?.code === 200 ? data.data : null), [data])
  return { course, isLoading, isPending, refetch }
}

export function useCreateCourseTransactionMutation({ successAction } = {}) {
  const createCourseTransactionMutation = useMutation({
    mutationFn: (data) => createCourseTransactionAction({ body: data.payload }),
    onSuccess: (data) => {
      if (data?.code === 201 || data?.code === 200) {
        if (successAction) successAction()
      } else {
        toast.error(data?.message || 'Transaction failed')
      }
    },
    onError: (error) => toast.error(error?.message || 'Something went wrong'),
  })
  return { createCourseTransactionMutation }
}

/* =========================================================
   BACKOFFICE / ADMIN HOOKS
   ========================================================= */

// 1. GET ALL // ADMIN
export function useGetAllCourseAdmin({ params }) {
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['getAllCourseAdmin', params],
    queryFn: () => getAllCourseAdminAction({ params }),
    refetchOnWindowFocus: false,
  })
  return {
    courses: data?.data ?? [],

    meta: data?.pagination ?? null,
    isLoading,
    refetch,
  }
}

// 2. GET BY ID ADMIN
export function useGetCourseByIdAdmin({ courseId }) {
  const { data, isLoading } = useQuery({
    queryKey: ['getCourseByIdAdmin', courseId],
    queryFn: () => getCourseByIdAdminAction({ id: courseId }),
    enabled: !!courseId,
  })
  return { course: data?.data ?? null, isLoading }
}

// 3. CREATE ADMIN (DIRECT AXIOS CALL)
export function useCreateCourseAdminMutation({ onSuccess } = {}) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload) => {
      try {
        const body = buildCourseFormData(payload)

        const res = await request.post('/course', body)
        return res.data
      } catch (error) {
        throw handleAxiosError(error)
      }
    },
    onSuccess: (res) => {
      if (res?.code === 201 || res?.code === 200) {
        toast.success('Course created successfully')
        queryClient.invalidateQueries({ queryKey: ['getAllCourseAdmin'] })
        if (onSuccess) onSuccess(res)
      } else {
        toast.error(res?.message || 'Failed to create course')
      }
    },
    onError: (err) => {
      toast.error(err.message || 'Error occurred')
    },
  })
}

// 4.  (DIRECT AXIOS CALL & SANITIZE)
export function useUpdateCourseAdminMutation({ onSuccess } = {}) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (props) => {
      try {
        const { id } = props
        const rawBody = props.body || props.data || {}
        const hasFile = rawBody.cover instanceof File

        let payload

        if (hasFile) {
          payload = buildCourseFormData(rawBody)
        } else {
          payload = {
            title: rawBody.title,
            code: rawBody.code,
            description: rawBody.description,
            content: rawBody.content,
            price: rawBody.price ? Number(rawBody.price) : undefined,
            is_open_registration_member: rawBody.is_open_registration_member,
            is_open_registration_mentor: rawBody.is_open_registration_mentor,
          }
        }

        // Langsung panggil API Backend
        const res = await request.patch(`/course/${id}`, payload)
        return res.data
      } catch (error) {
        throw handleAxiosError(error)
      }
    },
    onSuccess: (res) => {
      if (res?.code === 200) {
        toast.success('Course updated successfully')
        queryClient.invalidateQueries({ queryKey: ['getAllCourseAdmin'] })
        queryClient.invalidateQueries({ queryKey: ['getCourseByIdAdmin'] })
        if (onSuccess) onSuccess(res)
      } else {
        toast.error(res?.message || 'Update failed')
      }
    },
    onError: (err) => toast.error(err.message),
  })
}

// 5. DELETE ADMIN
export function useDeleteCourseAdminMutation({ onSuccess } = {}) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id) => deleteCourseAction({ id }),
    onSuccess: (r) => {
      if (r?.code === 200) {
        toast.success('Course deleted')
        queryClient.invalidateQueries({ queryKey: ['getAllCourseAdmin'] })
        if (onSuccess) onSuccess()
      } else {
        toast.error(r?.message || 'Delete failed')
      }
    },
    onError: (err) => toast.error(err.message),
  })
}
