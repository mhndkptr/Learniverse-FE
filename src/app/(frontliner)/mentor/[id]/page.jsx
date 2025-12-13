import MentorDetailPageComponent from './MentorDetailPageComponent'

export const metadata = {
  title: 'Mentor Profile | Learniverse',
}

export default async function MentorDetailPage({ params }) {
  const mentorId = (await params).id // Mengambil ID dari URL
  return <MentorDetailPageComponent mentorId={mentorId} />
}
