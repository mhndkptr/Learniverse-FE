'use server'

import request, { handleAxiosError } from '@/utils/baseRequest'

// GET ALL COURSE
export async function getAllCourseAction({ params }) {
  try {
    const res = await request.get('/course', { params })
    return res.data
  } catch (error) {
    return handleAxiosError(error)
  }
}

// GET COURSE BY ID
export async function getCourseByIdAction({ id }) {
  try {
    const res = await request.get(`/course/${id}`)
    return res.data
  } catch (error) {
    return handleAxiosError(error)
  }
}

export async function createCourseTransactionAction({ body }) {
  try {
    const res = await request.post('/course/transaction', body)
    return res.data
  } catch (error) {
    return handleAxiosError(error)
  }
}
