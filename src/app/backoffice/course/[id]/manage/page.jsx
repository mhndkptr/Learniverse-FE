import CourseManagePageComponent from './CourseManagePageComponent'

export const metadata = {
  title: 'Manage Course | Backoffice',
}

export default async function BackofficeCourseManagePage({ params }) {
  const id = (await params).id
  return <CourseManagePageComponent id={id} />
}
