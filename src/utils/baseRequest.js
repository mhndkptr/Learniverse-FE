import axios from 'axios'
import { getAuthCookies, setAuthCookies } from './cookies'
import { logout } from '@/actions/auth.action'
import Cookies from 'js-cookie'

export const axiosBaseConfig = {
  baseURL: `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/${process.env.NEXT_PUBLIC_API_VERSION}`,
  headers: {
    'X-Client-Type': 'web',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': '*',
    'Access-Control-Allow-Methods': '*',
    'Access-Control-Allow-Credentials': 'true',
  },
  withCredentials: true,
  timeout: 30000,
}

const request = axios.create(axiosBaseConfig)

// Request interceptor
request.interceptors.request.use(
  async (config) => {
    if (typeof window === 'undefined') {
      const { access_token } = await getAuthCookies()
      if (access_token) {
        config.headers['Authorization'] = `Bearer ${access_token}`
      }
    } else {
      const access_token = Cookies.get('access_token')
      if (access_token) {
        config.headers['Authorization'] = `Bearer ${access_token}`
      }
    }

    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor
request.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.code === 'ERR_NETWORK') {
      await logout()
      window.location.replace('/auth/login')
      return Promise.reject(error)
    }
    const originalRequest = error.config

    if (error?.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      try {
        const res = await axios.post(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/${process.env.NEXT_PUBLIC_API_VERSION}/auth/refresh-token`,
          {},
          axiosBaseConfig
        )

        let newAccessToken

        if (typeof window === 'undefined') {
          await setAuthCookies(res.headers)

          newAccessToken = res.headers['authorization']?.replace('Bearer ', '')
        } else {
          const authHeader = res.headers['authorization']
          newAccessToken = authHeader?.replace('Bearer ', '')

          if (newAccessToken) {
            Cookies.set('access_token', newAccessToken)
          }
        }

        if (!newAccessToken) {
          throw new Error('Could not get new access_token after refresh')
        }

        originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`
        return request(originalRequest)
      } catch (refreshError) {
        await logout()
        window.location.href = '/auth/login'
        return Promise.reject(refreshError)
      }
    } else if (error?.response?.status === 403) {
      throw Object.assign(new Error('Unauthorized Access'), {
        statusCode: 403,
      })
    }
    return Promise.reject(error)
  }
)

export default request

export function handleAxiosError(error) {
  let errorResponse

  if (axios.isAxiosError(error) && error.response) {
    errorResponse = {
      message:
        error.response.data?.message || error.message || 'Unknown API error',
      data: error.response?.data?.data || null,
      code: error.response.data?.code || error.response.status,
    }
  } else if (axios.isAxiosError(error)) {
    errorResponse = {
      message: 'Network Error or Request Timeout',
      data: null,
      code: 503,
    }
  } else {
    errorResponse = {
      message: error.message || 'Unknown Internal Error',
      data: null,
      code: 500,
    }
  }
  errorResponse.success = false

  return errorResponse
}
