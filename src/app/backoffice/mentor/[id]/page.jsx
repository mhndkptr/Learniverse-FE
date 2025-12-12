import MentorDetailPageComponent from './MentorDetailPageComponent'

export const metadata = {
  title: 'Mentor Detail | Backoffice',
}

export default async function BackofficeMentorDetailPage({ params }) {
  const id = (await params).id
  return <MentorDetailPageComponent id={id} />
}
