import { useState, useEffect } from 'react'
import { getMentorList } from '../mentor.action'

export default function useMentorListHook() {
  const [mentors, setMentors] = useState([])
  const [meta, setMeta] = useState(null)
  const [loading, setLoading] = useState(true)

  const [params, setParams] = useState({
    pagination: { page: 1, limit: 10 },
    search: '',
    include_relation: ['user', 'course'],
    filter: {
      status: 'ACCEPTED',
    },
  })

  const fetchData = async () => {
    setLoading(true)
    try {
      const res = await getMentorList(params)
      setMentors(res.data)
      setMeta(res.meta)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [params])

  return {
    mentors,
    meta,
    params,
    setParams,
    loading,
  }
}
