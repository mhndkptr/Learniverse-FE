import MentorDetailAprovalPageComponent from './MentorDetailAprovalPageComponent'

export const metadata = {
  title: 'Review Mentor Application | Backoffice',
}

export default async function MentorReviewPage({ params }) {
  const { id, mentorId } = await params

  return <MentorDetailAprovalPageComponent courseId={id} mentorId={mentorId} />
}
