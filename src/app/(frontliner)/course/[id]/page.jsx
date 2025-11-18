import CourseDetailPageComponent from './CourseDetailPageComponent'

export const metadata = {
  title: 'Course | Learniverse',
}

export default async function CourseDetailPage({ params }) {
  const id = (await params).id
  return <CourseDetailPageComponent id={id} />
}
