'use client'

import { useAuth } from '@/contexts/auth.context'
import ProfileLayout from '@/components/core/profile/ProfileLayout'
import SideBarProfile from '@/components/layout/sidebar/SideBarProfile'
import ProfileAvatar from '@/components/core/profile/ProfileAvatar'
import ReadonlyField from '@/components/core/profile/ReadonlyField'

export default function ProfilePage() {
  const { user, isAuthLoading } = useAuth()

  if (isAuthLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center text-gray-500">
        Loading profile...
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center text-gray-500">
        Profile not available. Please sign in.
      </div>
    )
  }

  const fields = [
    { label: 'Fullname', value: user?.name },
    { label: 'Username', value: user?.username },
    { label: 'Email', value: user?.email },
    { label: 'Phone Number', value: user?.phone_number },
    { label: 'Role', value: user?.role },
    {
      label: 'Joined Learniverse',
      value: user?.created_at
        ? new Date(user.created_at).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          })
        : '',
    },
  ]

  return (
    <ProfileLayout>
      <SideBarProfile
        items={[
          { label: 'Akun', href: '/my/profile' },
          { label: 'Edit Profile', href: '/my/profile/edit' },
          { label: 'Ubah Password', href: '/my/profile/password' },
          { label: 'Delete Akun', href: '/my/profile/delete' },
        ]}
      />

      <section className="flex-1 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-bold text-gray-900">Detail akun</h2>
        <div className="mt-4 grid gap-6 md:grid-cols-[180px,1fr]">
          <div className="flex flex-col items-center gap-3">
            <ProfileAvatar name={user?.name} src={user?.profile_uri} />
            <span className="text-sm text-gray-600">Foto Profile</span>
          </div>

          <div className="space-y-3">
            {fields.map((item) => (
              <ReadonlyField
                key={item.label}
                label={item.label}
                value={item.value}
              />
            ))}
          </div>
        </div>
      </section>
    </ProfileLayout>
  )
}
