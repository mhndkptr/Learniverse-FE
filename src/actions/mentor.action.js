'use server'

import request, { handleAxiosError } from '@/utils/baseRequest'

// --- BACKOFFICE ADMIN ACTIONS ---

// GET ALL MENTORS (List for Table)
export async function getAllMentorAdminAction({ params }) {
  try {
    const res = await request.get('/mentor', { params })
    return res.data
  } catch (error) {
    return handleAxiosError(error)
  }
}

// GET MENTOR DETAIL
export async function getMentorByIdAction({ id }) {
  try {
    const res = await request.get(`/mentor/${id}`)
    return res.data
  } catch (error) {
    return handleAxiosError(error)
  }
}

// DELETE MENTOR
export async function deleteMentorAction({ id }) {
  try {
    const res = await request.delete(`/mentor/${id}`)
    return res.data
  } catch (error) {
    return handleAxiosError(error)
  }
}

// APPROVE MENTOR
export async function approveMentorAction(id) {
  try {
    const res = await request.patch(`/mentor/${id}`, { status: 'ACCEPTED' })
    return res.data
  } catch (error) {
    return handleAxiosError(error)
  }
}

// REJECT MENTOR
export async function rejectMentorAction(id, reason) {
  try {
    const res = await request.patch(`/mentor/${id}`, {
      status: 'REJECTED',
      reason: reason,
    })
    return res.data
  } catch (error) {
    return handleAxiosError(error)
  }
}

// --- FRONTLINER / REGISTRATION ACTIONS ---

export async function createMentorRegistrationAction({ body }) {
  try {
    const res = await request.post('/mentor', body)
    return res.data
  } catch (error) {
    return handleAxiosError(error)
  }
}

// validasi/approval list
export async function getPendingMentorRegistrationsAction() {
  try {
    const res = await request.get('/mentor', {
      params: { filter: { status: 'ON_REVIEW' }, include_relation: ['user'] },
    })
    return res.data
  } catch (error) {
    return handleAxiosError(error)
  }
}
