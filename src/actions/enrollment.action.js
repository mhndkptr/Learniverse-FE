'use server'

import request, { handleAxiosError } from '@/utils/baseRequest'

export async function getEnrollmentListAction(params) {
  try {
    // Memanggil endpoint backend yang sudah ada
    // Endpoint ini mendukung filtering, sorting, dan include relation (user, course)
    const res = await request.get('/course/transaction', { params })
    return res.data
  } catch (error) {
    return handleAxiosError(error)
  }
}
