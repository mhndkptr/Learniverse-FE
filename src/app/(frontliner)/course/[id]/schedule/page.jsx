import CourseSchedulePageComponent from './CourseSchedulePageComponent'

export default async function ScheduleCoursePage({ params }) {
  const { id } = await params
  return <CourseSchedulePageComponent courseId={id} />
}
