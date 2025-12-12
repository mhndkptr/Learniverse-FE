'use server'

import request, { handleAxiosError } from '@/utils/baseRequest'

export async function createQuizAction({ body }) {
  try {
    const res = await request.post('/quiz', body)
    return res.data
  } catch (error) {
    return handleAxiosError(error)
  }
}

export async function updateQuizAction({ id, body }) {
  try {
    const res = await request.patch(`/quiz/${id}`, body)
    return res.data
  } catch (error) {
    return handleAxiosError(error)
  }
}

export async function deleteQuizAction({ id }) {
  try {
    const res = await request.delete(`/quiz/${id}`)
    return res.data
  } catch (error) {
    return handleAxiosError(error)
  }
}
