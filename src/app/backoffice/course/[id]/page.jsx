import CourseDetailBackofficePageComponent from './CourseDetailBackofficePageComponent'

export const metadata = {
  title: 'Course Detail | Backoffice',
}

export default async function BackofficeCourseDetailPage({ params }) {
  const id = (await params).id
  return <CourseDetailBackofficePageComponent id={id} />
}
