'use client'

import { useState } from 'react'
import { EyeIcon, EyeOffIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import Image from 'next/image'
import z from 'zod'
import { toast } from 'sonner'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useAuth } from '@/contexts/auth.context'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'

const loginFormSchema = z.object({
  email: z.string().email({ message: 'Email tidak valid' }),
  password: z
    .string()
    .min(8, { message: 'Password harus memiliki minimal 8 karakter' }),
})

export default function LoginPageComponent() {
  const { login, isAuthLoading } = useAuth()

  const [showPassword, setShowPassword] = useState(false)

  const loginFormConfig = useForm({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const handleLoginFormSubmit = async (data) => {
    try {
      await login({ body: data })
    } catch (error) {
      toast.error(error?.message || 'Login failed. Please try again.')
    }
  }

  return (
    <div className="flex">
      <main className="flex w-full justify-center px-16 py-32">
        <div className="hidden lg:flex lg:w-2/5">
          <Image
            src="/assets/images/img-discuss.png"
            alt="Team collaboration"
            width={4096}
            height={2730}
            className="h-full max-h-[60vh] w-full rounded-3xl object-cover"
          />
        </div>

        {/* Right Side - Login Form */}
        <div className="flex w-full items-start justify-center lg:w-1/2">
          <div className="w-full max-w-md">
            {/* Header */}
            <div className="mb-8">
              <h1 className="mb-2 text-center text-4xl font-bold text-slate-900">
                Login to continue
              </h1>
            </div>

            {/* Form */}
            <Form {...loginFormConfig}>
              <form
                onSubmit={loginFormConfig.handleSubmit(handleLoginFormSubmit)}
                className="flex flex-col space-y-4 sm:space-y-5 lg:space-y-6"
              >
                <FormField
                  control={loginFormConfig.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-slate-700">
                        Email
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="Enter your email"
                          {...field}
                          disabled={isAuthLoading}
                          className="w-full rounded-lg border border-slate-300 px-4 py-3 focus:border-slate-400 focus:ring-1 focus:ring-slate-300 focus:outline-none"
                          required
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={loginFormConfig.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-slate-700">
                        Password
                      </FormLabel>
                      <FormControl>
                        <div className="group relative">
                          <Input
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Enter your password"
                            {...field}
                            disabled={isAuthLoading}
                            className="w-full rounded-lg border border-slate-300 px-4 py-3 pr-10 focus:border-slate-400 focus:ring-1 focus:ring-slate-300 focus:outline-none"
                            required
                          />
                          <button
                            disabled={isAuthLoading}
                            type="button"
                            className="absolute inset-y-0 right-0 flex w-8 items-center pr-3 text-[#8E8E8E]"
                            onClick={() => setShowPassword((prev) => !prev)}
                          >
                            {showPassword ? <EyeIcon /> : <EyeOffIcon />}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="mt-5">
                  <Button
                    disabled={isAuthLoading}
                    type="submit"
                    variant="primary"
                    className="w-full rounded-lg py-3.5 font-semibold"
                  >
                    {isAuthLoading ? 'Logging in...' : 'Login'}
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </div>
      </main>
    </div>
  )
}
