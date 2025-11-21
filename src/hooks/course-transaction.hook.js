import { getAllCourseTransactionAction } from '@/actions/course-transaction.action'
import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'

export function useGetAllCourseTransaction({ params = {} }) {
  const { data, isLoading, isPending, refetch } = useQuery({
    queryKey: ['getCourseTransactions', params],
    queryFn: () => getAllCourseTransactionAction(params),
    retry: false,
    staleTime: 300000, // 5 menit
    cacheTime: Infinity, // Cache tidak akan dihapus
    refetchOnMount: true, // Tidak refetch saat komponen di-mount ulang
    refetchOnWindowFocus: false, // Tidak refetch saat fokus kembali ke tab
    onError: (error) => {
      toast.error('Something went wrong!', {
        description: error.message
          ? error.message
          : 'Unexpected error occurred!',
      })
    },
  })

  const courseTransactions = useMemo(() => {
    return data?.code === 200 ? data.data : []
  }, [data])

  return {
    courseTransactions,
    isLoading,
    isPending,
    refetch,
  }
}
