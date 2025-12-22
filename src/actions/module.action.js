'use server'

import request, { handleAxiosError } from '@/utils/baseRequest'

export async function getAllModuleAction({ params }) {
  try {
    const res = await request.get('/modul', { params })
    return res.data
  } catch (error) {
    return handleAxiosError(error)
  }
}

export async function createModuleAction({ body }) {
  try {
    const res = await request.post('/modul', body)
    return res.data
  } catch (error) {
    return handleAxiosError(error)
  }
}

export async function updateModuleAction({ id, body }) {
  try {
    const res = await request.put(`/modul/${id}`, body)
    return res.data
  } catch (error) {
    return handleAxiosError(error)
  }
}

export async function deleteModuleAction({ id }) {
  try {
    const res = await request.delete(`/modul/${id}`)
    return res.data
  } catch (error) {
    return handleAxiosError(error)
  }
}
