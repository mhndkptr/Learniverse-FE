'use client'

import React, { createContext, useContext, useState } from 'react'

const BackofficeBreadcrumbContext = createContext()

export function BackofficeBreadcrumbProvider({ children }) {
  const [breadcrumb, setBreadcrumb] = useState([])
  return (
    <BackofficeBreadcrumbContext.Provider value={{ breadcrumb, setBreadcrumb }}>
      {children}
    </BackofficeBreadcrumbContext.Provider>
  )
}

export function useBackofficeBreadcrumb() {
  return useContext(BackofficeBreadcrumbContext)
}
