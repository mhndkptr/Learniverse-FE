'use server'

import request, { handleAxiosError } from '@/utils/baseRequest'

export async function getEnrollmentListAction(params) {
  try {
    const res = await request.get('/course/enrollment', { params })
    return res.data
  } catch (error) {
    return handleAxiosError(error)
  }
}
