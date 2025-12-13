'use server'

import request, { handleAxiosError } from '@/utils/baseRequest'

export async function getAllUserAction(params) {
  try {
    const res = await request.get('/user', { params })
    return res.data
  } catch (error) {
    return handleAxiosError(error)
  }
}

export async function updateUserAction({ id, body }) {
  try {
    const res = await request.patch(`/user/${id}`, body)
    return res.data
  } catch (error) {
    return handleAxiosError(error)
  }
}

export async function deleteUserAction({ id }) {
  try {
    const res = await request.delete(`/user/${id}`)
    return res.data
  } catch (error) {
    return handleAxiosError(error)
  }
}
