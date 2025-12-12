'use server'
import request, { handleAxiosError } from '@/utils/baseRequest'

export async function createMentorRegistrationAction({ body }) {
  try {
    const res = await request.post('/mentor', body)
    return res.data
  } catch (error) {
    return handleAxiosError(error)
  }
}

export async function getPendingMentorRegistrationsAction() {
  try {
    const res = await axios.get('/mentors/registrations?status=pending')
    return res.data
  } catch (error) {
    return { code: 500, message: error.message }
  }
}

export async function approveMentorAction(id) {
  try {
    const res = await axios.patch(`/mentors/registrations/${id}/approve`)
    return res.data
  } catch (error) {
    return { code: 500, message: error.message }
  }
}

export async function rejectMentorAction(id, reason) {
  try {
    const res = await axios.patch(`/mentors/registrations/${id}/reject`, {
      reason,
    })
    return res.data
  } catch (error) {
    return { code: 500, message: error.message }
  }
}

export const getMentorList = async (params = {}) => {
  try {
    const query = new URLSearchParams(params).toString()
    const { data } = await axios.get(`/mentor?${query}`)

    return data
  } catch (error) {
    throw error.response?.data || error
  }
}

export async function getMentorByIdAction(id) {
  try {
    const res = await request.get(`/mentor/${id}`)
    return res.data
  } catch (error) {
    return handleAxiosError(error)
  }
}
