'use server'

import request, { handleAxiosError } from '@/utils/baseRequest'

export async function getQuizByIdAction({ id }) {
  try {
    const res = await request.get(`/quiz/${id}`)
    return res.data
  } catch (error) {
    return handleAxiosError(error)
  }
}

export async function getAllActiveQuizAction() {
  try {
    const res = await request.get(`/quiz/me/active`)
    return res.data
  } catch (error) {
    return handleAxiosError(error)
  }
}

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

export async function updateQuizQuestionAction({ id, body }) {
  try {
    const res = await request.patch(`/quiz/question/${id}`, body)
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

export async function deleteQuizQuestionAction({ id }) {
  try {
    const res = await request.delete(`/quiz/question/${id}`)
    return res.data
  } catch (error) {
    return handleAxiosError(error)
  }
}

export async function createQuizQuestionAction({ body }) {
  try {
    const res = await request.post('/quiz/question', body)
    return res.data
  } catch (error) {
    return handleAxiosError(error)
  }
}
