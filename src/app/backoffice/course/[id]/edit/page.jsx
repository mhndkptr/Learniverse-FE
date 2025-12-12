import CourseEditPageComponent from './CourseEditPageComponent'

export const metadata = {
  title: 'Edit Course | Backoffice',
}

export default async function BackofficeCourseEditPage({ params }) {
  const id = (await params).id

  return <CourseEditPageComponent id={id} />
}
