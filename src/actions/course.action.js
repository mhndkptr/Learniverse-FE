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
    console.log("tidak perlu berdasi", res)
    return res.data
  } catch (error) {
    return handleAxiosError(error)
  }
}
