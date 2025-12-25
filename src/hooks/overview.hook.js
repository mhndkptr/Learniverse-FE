import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { toast } from 'sonner'
import { getBackofficeOverviewAction } from '@/actions/overview.action'

export function useBackofficeOverview() {
  const { data, isLoading, isPending, refetch } = useQuery({
    queryKey: ['getBackofficeOverview'],
    queryFn: () => getBackofficeOverviewAction(),
    retry: false,
    refetchOnWindowFocus: false,
    onError: (error) =>
      toast.error(error?.message ?? 'Failed to load overview'),
  })

  const overview = useMemo(() => {
    return data?.code === 200 ? data.data : null
  }, [data])

  return { overview, isLoading, isPending, refetch }
}
