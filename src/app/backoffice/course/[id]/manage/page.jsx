import { redirect } from 'next/navigation'

export const metadata = {
  title: 'Manage Course | Backoffice',
}

export default async function BackofficeCourseManagePage({ params }) {
  const { id } = await params
  redirect(`/backoffice/course/${id}/manage/general`)
}
