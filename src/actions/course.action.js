'use server'

import request, { handleAxiosError } from '@/utils/baseRequest'

/* =========================================================
   FRONTLINER SECTION
   ========================================================= */
export async function getAllCourseAction({ params }) {
  try {
    const res = await request.get('/course', { params })
    return res.data
  } catch (error) {
    return handleAxiosError(error)
  }
}

export async function getAllEnrolledCourseAction() {
  try {
    const res = await request.get('/course/me')
    return res.data
  } catch (error) {
    return handleAxiosError(error)
  }
}

export async function getCourseByIdAction({ id }) {
  try {
    const res = await request.get(`/course/${id}`)
    return res.data
  } catch (error) {
    return handleAxiosError(error)
  }
}

export async function createCourseTransactionAction({ body }) {
  try {
    const res = await request.post('/course/transaction', body)
    return res.data
  } catch (error) {
    return handleAxiosError(error)
  }
}

/* =========================================================
   BACKOFFICE / ADMIN SECTION 
   ========================================================= */

export const getAllCourseAdminAction = async ({ params }) => {
  try {
    const res = await request.get('/course', { params })
    return res.data
  } catch (e) {
    return handleAxiosError(e)
  }
}

export const getCourseByIdAdminAction = async ({ id }) => {
  try {
    const res = await request.get(`/course/${id}`)
    return res.data
  } catch (e) {
    return handleAxiosError(e)
  }
}

export const createCourseAction = async ({ body }) => {
  try {
    const res = await request.post('/course', body)
    return res.data
  } catch (e) {
    return handleAxiosError(e)
  }
}

export async function updateCourseAction({ id, body }) {
  try {
    const res = await request.patch(`/course/${id}`, body)
    return res.data
  } catch (error) {
    return handleAxiosError(error)
  }
}

export const deleteCourseAction = async ({ id }) => {
  try {
    const res = await request.delete(`/course/${id}`)
    return res.data
  } catch (e) {
    return handleAxiosError(e)
  }
}
