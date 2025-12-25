'use client'

import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import ProfileLayout from '@/components/core/profile/ProfileLayout'
import SideBarProfile from '@/components/layout/sidebar/SideBarProfile'
import ProfileAvatar from '@/components/core/profile/ProfileAvatar'
import { useAuth } from '@/contexts/auth.context'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { updateUserAction } from '@/actions/user.action'

export default function EditProfilePage() {
  const { user, isAuthLoading, setUser } = useAuth()
  const [form, setForm] = useState({
    name: '',
    username: '',
    phone_number: '',
    profile_uri: '',
    email: '',
  })
  const [isSaving, setIsSaving] = useState(false)
  const [profileFile, setProfileFile] = useState(null)
  const [preview, setPreview] = useState(null)

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || '',
        username: user.username || '',
        phone_number: user.phone_number || '',
        profile_uri: user.profile_uri || '',
        email: user.email || '',
      })
      setPreview(user.profile_uri || null)
    }
  }, [user])

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

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }))
  }

  const handleFileChange = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      setProfileFile(file)
      setPreview(URL.createObjectURL(file))
    }
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      const trimmedName = form.name.trim()
      const trimmedUsername = form.username.trim()
      const trimmedEmail = form.email.trim()
      const trimmedPhone = form.phone_number.trim()

      const emailPattern = /^[^@\s]+@[^@\s]+\.[^@\s]+$/
      const phonePattern = /^\+?[0-9]+$/

      if (!trimmedName) {
        throw new Error('Name is required')
      }
      if (!trimmedUsername) {
        throw new Error('Username is required')
      }
      if (!emailPattern.test(trimmedEmail)) {
        throw new Error('Email must include a valid domain')
      }
      if (trimmedPhone && !phonePattern.test(trimmedPhone)) {
        throw new Error('Phone number must contain digits only (optional +)')
      }

      const payload = new FormData()
      payload.append('name', trimmedName)
      payload.append('username', trimmedUsername)
      payload.append('phone_number', trimmedPhone)
      payload.append('email', trimmedEmail)
      if (profileFile) {
        payload.append('profile_uri', profileFile)
      }

      const res = await updateUserAction({ id: user.id, body: payload })
      if (res?.code === 200) {
        toast.success('Profile updated')
        setUser?.({
          ...user,
          name: form.name,
          username: form.username,
          phone_number: form.phone_number,
          email: form.email,
          profile_uri: res?.data?.profile_uri || user.profile_uri,
        })
      } else {
        toast.error(res?.message || 'Failed to update profile')
      }
    } catch (err) {
      toast.error(err?.message || 'Failed to update profile')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <ProfileLayout>
      <SideBarProfile
        items={[
          { label: 'Akun', href: '/my/profile' },
          { label: 'Edit Profile', href: '/my/profile/edit' },
          { label: 'Ubah Password', href: '/my/profile/password' },
        ]}
      />

      <section className="flex-1 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-bold text-gray-900">Edit akun</h2>
        <div className="mt-4 grid gap-6 md:grid-cols-[180px,1fr]">
          <div className="flex flex-col items-center gap-3">
            <ProfileAvatar name={user?.name} src={preview} />
            <Input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full"
            />
          </div>

          <div className="space-y-3">
            <div className="space-y-1">
              <p className="text-sm font-medium text-gray-800">Fullname</p>
              <Input
                value={form.name}
                onChange={handleChange('name')}
                placeholder="Your name"
              />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-gray-800">Username</p>
              <Input
                value={form.username}
                onChange={handleChange('username')}
                placeholder="Username"
              />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-gray-800">Phone Number</p>
              <Input
                value={form.phone_number}
                onChange={handleChange('phone_number')}
                placeholder="08xxxxxxxxxx"
              />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-gray-800">Email</p>
              <Input
                type="email"
                value={form.email}
                onChange={handleChange('email')}
                placeholder="email@example.com"
              />
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <Button
            variant="secondary"
            className="bg-gray-100 text-gray-800 hover:bg-gray-200"
            onClick={() => window.history.back()}
          >
            Cancel
          </Button>
          <Button
            className="bg-[#0E1B50] text-white hover:bg-blue-900"
            onClick={handleSave}
            disabled={isSaving}
          >
            {isSaving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </section>
    </ProfileLayout>
  )
}
