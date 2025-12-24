import CourseManagePageComponent from './CourseManagePageComponent'

export const metadata = {
  title: 'Manage Course | Backoffice',
}

export default function BackofficeCourseManageLayout({ children }) {
  return <CourseManagePageComponent>{children}</CourseManagePageComponent>
}
