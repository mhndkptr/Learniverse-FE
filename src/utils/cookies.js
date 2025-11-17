'use server'

import { cookies } from 'next/headers'

export async function setAuthCookies(headers) {
  const cookieStore = cookies()

  const access_token = headers['authorization']?.replace('Bearer ', '')

  if (access_token) {
    ;(await cookieStore).set('access_token', access_token, {
      secure: true,
      sameSite: 'strict',
    })
  }

  const setCookieHeader = headers['set-cookie']

  if (setCookieHeader) {
    for (const cookieString of setCookieHeader) {
      if (cookieString.startsWith('refresh_token=')) {
        const tokenValue = cookieString
          .substring('refresh_token='.length)
          .split(';')[0]

        ;(await cookieStore).set('refresh_token', tokenValue, {
          httpOnly: true,
          sameSite: 'strict',
          secure: true,
        })
      }
    }
  }
}

export async function clearAuthCookies() {
  const cookieStore = cookies()
  ;(await cookieStore).delete('access_token')
  ;(await cookieStore).delete('refresh_token')
}

export async function getAuthCookies() {
  const cookieStore = cookies()
  const access_token = (await cookieStore).get('access_token')?.value || null
  const refresh_token = (await cookieStore).get('refresh_token')?.value || null

  return { access_token, refresh_token }
}
