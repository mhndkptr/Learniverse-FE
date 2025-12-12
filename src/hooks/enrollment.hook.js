import { useQuery } from '@tanstack/react-query'
import { toast } from 'sonner'
import { useMemo } from 'react'
import { getEnrollmentListAction } from '@/actions/enrollment.action'

export function useEnrollmentList({ params = {} }) {
  const { data, isLoading, isPending, refetch } = useQuery({
    queryKey: ['getEnrollmentList', params],
    queryFn: () => getEnrollmentListAction(params),
    retry: false,
    refetchOnWindowFocus: false,
    // Menjaga data lama tetap tampil saat loading halaman baru (ux lebih baik)
    placeholderData: (previousData) => previousData,
    onError: (error) => {
      toast.error('Gagal memuat data enrollment', {
        description: error.message || 'Terjadi kesalahan saat mengambil data.',
      })
    },
  })

  // Mengambil array data dari response backend standard
  const enrollments = useMemo(() => {
    return data?.code === 200 ? data.data : []
  }, [data])

  // Mengambil metadata pagination
  const meta = useMemo(() => {
    return data?.pagination || data?.meta || null
  }, [data])

  return {
    enrollments,
    meta,
    isLoading,
    isPending,
    refetch,
  }
}
