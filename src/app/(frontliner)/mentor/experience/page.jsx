import MentorExperience from '@/components/core/mentor/MentorExperience'

export default function Page({ params }) {
  const { id } = params

  return <MentorExperience mentorId={id} />
}
