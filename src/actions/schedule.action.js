'use server'

import request, { handleAxiosError } from '@/utils/baseRequest'

// GET ALL SCHEDULE
export async function getAllScheduleAction({ params }) {
  try {
    const res = await request.get('/schedule', { params })
    return res.data
  } catch (error) {
    return handleAxiosError(error)
  }
}

// CREATE SCHEDULE
export async function createScheduleAction({ body }) {
  try {
    const res = await request.post('/schedule', body)
    return res.data
  } catch (error) {
    return handleAxiosError(error)
  }
}

// UPDATE SCHEDULE
export async function updateScheduleAction({ id, body }) {
  try {
    const res = await request.put(`/schedule/${id}`, body)
    return res.data
  } catch (error) {
    return handleAxiosError(error)
  }
}

// DELETE SCHEDULE
export async function deleteScheduleAction({ id }) {
  try {
    const res = await request.delete(`/schedule/${id}`)
    return res.data
  } catch (error) {
    return handleAxiosError(error)
  }
}
