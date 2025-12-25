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
    const isFormData =
      typeof FormData !== 'undefined' && body instanceof FormData
    const res = await request.patch(`/user/${id}`, body, {
      headers: isFormData
        ? {
            'Content-Type': 'multipart/form-data',
          }
        : undefined,
    })
    return res.data
  } catch (error) {
    return handleAxiosError(error)
  }
}

export async function changePasswordAction({ id, body }) {
  try {
    const res = await request.patch(`/user/${id}/change-password`, body)
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
