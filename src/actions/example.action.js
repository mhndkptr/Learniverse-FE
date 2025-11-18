'use server'

import request, { handleAxiosError } from '@/utils/baseRequest'

export async function getAllExampleAction({ body }) {
  try {
    const res = await request.get('/example', body)
    return res.data
  } catch (error) {
    return handleAxiosError(error)
  }
}

export async function getExampleByIdAction({ id }) {
  try {
    const res = await request.get(`/example/${id}`)
    return res.data
  } catch (error) {
    return handleAxiosError(error)
  }
}

export async function createExampleAction({ body }) {
  try {
    const res = await request.post('/example', body)
    return res.data
  } catch (error) {
    return handleAxiosError(error)
  }
}

export async function updateExampleAction({ id, body }) {
  try {
    const res = await request.put(`/example/${id}`, body)
    return res.data
  } catch (error) {
    return handleAxiosError(error)
  }
}

export async function deleteExampleAction({ id }) {
  try {
    const res = await request.delete(`/example/${id}`)
    return res.data
  } catch (error) {
    return handleAxiosError(error)
  }
}
