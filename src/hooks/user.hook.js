import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
  getAllUserAction,
  deleteUserAction,
  updateUserAction,
} from '@/actions/user.action'
import { useMemo } from 'react'

export function useGetAllUser({ params }) {
  const { data, isLoading, isPending, refetch } = useQuery({
    queryKey: ['getAllUser', params],
    queryFn: () => getAllUserAction(params),
    retry: false,
    refetchOnWindowFocus: false,
  })

  const users = useMemo(() => data?.data ?? [], [data])
  const meta = useMemo(() => data?.pagination ?? null, [data])

  return {
    users,
    meta,
    isLoading,
    isPending,
    refetch,
  }
}

export function useDeleteUserMutation({ onSuccess }) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id }) => deleteUserAction({ id }),
    onSuccess: (res) => {
      if (res?.code === 200) {
        toast.success('User deleted successfully')
        queryClient.invalidateQueries(['getAllUser'])
        if (onSuccess) onSuccess()
      } else {
        toast.error(res?.message || 'Failed to delete user')
      }
    },
    onError: (err) => toast.error(err.message),
  })
}
