'use server'

import request, { handleAxiosError } from '@/utils/baseRequest'

export async function getBackofficeOverviewAction() {
  try {
    const res = await request.get('/overview')
    return res.data
  } catch (error) {
    return handleAxiosError(error)
  }
}
