'use client'

import {
  useMentorApprovalList,
  useApproveMentor,
  useRejectMentor,
} from '@/hooks/mentor-approval.hook'

export default function ApprovalPendaftaranMentor() {
  const { data, isLoading } = useMentorApprovalList()
  const approveMutation = useApproveMentor()
  const rejectMutation = useRejectMentor()

  const handleApprove = (id) => {
    approveMutation.mutate(id)
  }

  const handleReject = (id) => {
    const reason = prompt('Masukkan alasan penolakan:')
    if (!reason) return
    rejectMutation.mutate({ id, reason })
  }

  if (isLoading) {
    return <p>Loading...</p>
  }

  return (
    <div className="rounded-lg border bg-white p-6">
      <h1 className="mb-4 text-2xl font-bold">Approval Pendaftaran Mentor</h1>

      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-3">Nama</th>
            <th className="border p-3">Reason</th>
            <th className="border p-3">Motivation</th>
            <th className="border p-3">CV</th>
            <th className="border p-3">Portfolio</th>
            <th className="border p-3 text-center">Action</th>
          </tr>
        </thead>

        <tbody>
          {data?.map((mentor) => (
            <tr key={mentor.id}>
              <td className="border p-3">{mentor.user.full_name}</td>
              <td className="border p-3">{mentor.reason}</td>
              <td className="border p-3">{mentor.motivation}</td>
              <td className="border p-3">
                <a
                  href={mentor.cv_uri}
                  className="text-blue-600"
                  target="_blank"
                >
                  Open CV
                </a>
              </td>
              <td className="border p-3">
                <a
                  href={mentor.portfolio_uri}
                  className="text-blue-600"
                  target="_blank"
                >
                  Open Portfolio
                </a>
              </td>

              <td className="border p-3 text-center">
                <button
                  className="mr-2 rounded bg-green-600 px-3 py-1 text-white"
                  onClick={() => handleApprove(mentor.id)}
                >
                  Approve
                </button>

                <button
                  className="rounded bg-red-600 px-3 py-1 text-white"
                  onClick={() => handleReject(mentor.id)}
                >
                  Reject
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
