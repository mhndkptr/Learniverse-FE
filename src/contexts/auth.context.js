'use client'

import { useRouter } from 'next/navigation'
import { createContext, useContext, useEffect, useState } from 'react'
import {
  logout as logoutAction,
  login as loginAction,
  register as registerAction,
} from '@/actions/auth.action'
import Cookies from 'js-cookie'
import { toast } from 'sonner'
import request from '@/utils/baseRequest'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [isAuthLoading, setIsAuthLoading] = useState(false)

  const fetchUser = async () => {
    setIsAuthLoading(true)
    await request
      .get('/auth/me')
      .then((res) => setUser(res.data.data))
      .catch(() => setUser(null))
      .finally(() => setIsAuthLoading(false))
  }

  useEffect(() => {
    if (user === null && Cookies.get('access_token')) {
      fetchUser()
    }
  }, [user])

  const handleError = (error) => {
    let parsedError

    try {
      parsedError = JSON.parse(error.message)
    } catch {
      parsedError = {
        message: error.message || 'Unknown error occurred',
        code: 500,
      }
    }

    throw parsedError
  }

  const login = async ({ body }) => {
    setIsAuthLoading(true)
    try {
      const res = await loginAction({ body })
      if (res.code !== 200) {
        toast.error(res?.message || 'Login failed')
        return
      }
      setUser(res?.data || null)
      if (res?.data?.role === 'ADMIN') {
        router.push('/backoffice')
      } else {
        router.push('/dashboard')
      }
    } catch (error) {
      return handleError(error)
    } finally {
      setIsAuthLoading(false)
    }
  }

  const register = async ({ body }) => {
    setIsAuthLoading(true)
    try {
      const res = await registerAction({ body })
      if (res.code !== 201 && res.code !== 200) {
        toast.error(res?.message || 'Registration failed')
        return
      } else {
        router.push('/auth/login')
        toast.success('Registration successful! Please log in.')
      }
    } catch (error) {
      return handleError(error)
    } finally {
      setIsAuthLoading(false)
    }
  }

  const logout = async () => {
    await logoutAction()
    setUser(null)
    router.push('/auth/login')
  }

  return (
    <>
      <AuthContext.Provider
        value={{
          user,
          setUser,
          isAuthLoading,
          setIsAuthLoading,
          logout,
          login,
          register,
        }}
      >
        {children}
      </AuthContext.Provider>
    </>
  )
}

export const useAuth = () => useContext(AuthContext)
