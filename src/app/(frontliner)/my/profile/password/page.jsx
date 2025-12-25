'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import ProfileLayout from '@/components/core/profile/ProfileLayout'
import SideBarProfile from '@/components/layout/sidebar/SideBarProfile'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/contexts/auth.context'
import { changePasswordAction } from '@/actions/user.action'

export default function UpdatePasswordPage() {
  const { user, isAuthLoading } = useAuth()
  const [oldPassword, setOldPassword] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConfirmation, setPasswordConfirmation] = useState('')
  const [isSaving, setIsSaving] = useState(false)

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

  const handleSave = async () => {
    const trimmedOldPassword = oldPassword.trim()
    const trimmedPassword = password.trim()
    const trimmedConfirmation = passwordConfirmation.trim()

    if (!trimmedOldPassword) {
      toast.error('Password lama wajib diisi')
      return
    }
    if (!trimmedPassword) {
      toast.error('Password is required')
      return
    }
    if (trimmedPassword.length < 8) {
      toast.error('Password minimal 8 karakter')
      return
    }
    if (!/[A-Z]/.test(trimmedPassword)) {
      toast.error('Password harus memiliki minimal 1 huruf besar')
      return
    }
    if (!/[^a-zA-Z0-9]/.test(trimmedPassword)) {
      toast.error('Password harus memiliki minimal 1 karakter spesial')
      return
    }
    if (trimmedPassword !== trimmedConfirmation) {
      toast.error('Password confirmation does not match password')
      return
    }

    setIsSaving(true)
    try {
      const res = await changePasswordAction({
        id: user.id,
        body: {
          old_password: trimmedOldPassword,
          new_password: trimmedPassword,
          new_password_confirmation: trimmedConfirmation,
        },
      })
      if (res?.code === 200) {
        toast.success('Password updated')
        setOldPassword('')
        setPassword('')
        setPasswordConfirmation('')
      } else {
        toast.error(res?.message || 'Failed to update password')
      }
    } catch (err) {
      toast.error(err?.message || 'Failed to update password')
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
        <h2 className="text-xl font-bold text-gray-900">Ubah password</h2>
        <div className="mt-4 space-y-3">
          <div className="space-y-1">
            <p className="text-sm font-medium text-gray-800">Password lama</p>
            <Input
              type="password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              placeholder="Masukkan password lama"
            />
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium text-gray-800">Password baru</p>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Masukkan password baru"
            />
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium text-gray-800">
              Konfirmasi password
            </p>
            <Input
              type="password"
              value={passwordConfirmation}
              onChange={(e) => setPasswordConfirmation(e.target.value)}
              placeholder="Ulangi password"
            />
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
