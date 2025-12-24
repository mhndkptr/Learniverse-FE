import { getObjValueByPath } from '@/utils/helper'

export default function sortData(data, sortConfig) {
  if (!data) return []
  if (!sortConfig.key) return data

  return [...data].sort((a, b) => {
    const valA = getObjValueByPath(a, sortConfig.key)
    const valB = getObjValueByPath(b, sortConfig.key)

    if (valA < valB) return sortConfig.direction === 'asc' ? -1 : 1
    if (valA > valB) return sortConfig.direction === 'asc' ? 1 : -1
    return 0
  })
}
