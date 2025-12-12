import { useQuery } from '@tanstack/react-query'
import { getMentorByIdAction } from '@/actions/mentor.action'

export default function useMentorDetail(id) {
  return useQuery({
    queryKey: ['mentor-detail', id],
    queryFn: () => getMentorByIdAction(id),
    enabled: !!id,
  })
}
