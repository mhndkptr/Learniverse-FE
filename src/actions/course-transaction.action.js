'use server'

import request, { handleAxiosError } from '@/utils/baseRequest'

export async function getAllCourseTransactionAction(params) {
  try {
    const res = await request.get('/course/transaction', { params })
    return res.data
  } catch (error) {
    return handleAxiosError(error)
  }
}
