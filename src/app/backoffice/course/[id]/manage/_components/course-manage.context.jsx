'use client'

import { createContext, useContext } from 'react'
import { useGetCourseById, useGetCourseByIdAdmin } from '@/hooks/course.hook'
import { useAuth } from '@/contexts/auth.context'

const CourseManageContext = createContext(null)

export function CourseManageProvider({ courseId, children }) {
  const { user, isAuthLoading } = useAuth()
  const isAdmin = user?.role === 'ADMIN'
  const adminCourseId = !isAuthLoading && isAdmin ? courseId : null
  const userCourseId = !isAuthLoading && !isAdmin ? courseId : null

  const adminQuery = useGetCourseByIdAdmin({ courseId: adminCourseId })
  const userQuery = useGetCourseById({ courseId: userCourseId })

  const course = isAdmin ? adminQuery.course : userQuery.course
  const isLoading =
    isAuthLoading || (isAdmin ? adminQuery.isLoading : userQuery.isLoading)
  const refetch = isAdmin ? adminQuery.refetch : userQuery.refetch

  return (
    <CourseManageContext.Provider
      value={{ course, courseId, isLoading, refetch, user, isAdmin }}
    >
      {children}
    </CourseManageContext.Provider>
  )
}

export function useCourseManage() {
  const context = useContext(CourseManageContext)
  if (!context) {
    throw new Error('useCourseManage must be used within CourseManageProvider')
  }
  return context
}
