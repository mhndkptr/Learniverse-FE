'use server'

import request, { handleAxiosError } from '@/utils/baseRequest'
import { setAuthCookies } from '@/utils/cookies'
import { cookies } from 'next/headers'

export async function login({ body }) {
  try {
    const res = await request.post('/auth/login', body)
    if (res.data.code === 200) {
      await setAuthCookies(res.headers)
    }
    return res.data
  } catch (error) {
    return handleAxiosError(error)
  }
}

export async function register({ body }) {
  try {
    const res = await request.post('/auth/register', body)
    return res.data
  } catch (error) {
    return handleAxiosError(error)
  }
}

export async function logout() {
  const cookieStore = cookies()
  ;(await cookieStore).delete('access_token')
  ;(await cookieStore).delete('refresh_token')
}

export async function refreshToken() {
  try {
    const res = await request.post('/auth/refresh-token')
    if (res.data.code === 200) {
      await setAuthCookies(res.headers)
    }
    return res.data
  } catch (error) {
    return handleAxiosError(error)
  }
}

export async function getMe() {
  try {
    const res = await request.get('/auth/me')
    return res.data
  } catch (error) {
    return handleAxiosError(error)
  }
}
