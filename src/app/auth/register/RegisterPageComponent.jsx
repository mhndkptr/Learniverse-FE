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

const registerFormSchema = z
  .object({
    name: z.string().min(1, { message: 'Name is required' }),
    username: z.string().min(1, { message: 'Username is required' }),
    email: z.string().email({ message: 'Email is not valid' }),
    phone_number: z.string().min(1, { message: 'Phone number is required' }),
    password: z
      .string()
      .min(8, { message: 'Password must be at least 8 characters' }),
    password_confirmation: z
      .string()
      .min(1, { message: 'Password confirmation is required' }),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: 'Password confirmation does not match',
    path: ['password_confirmation'],
  })

export default function RegisterPageComponent() {
  const { register, isAuthLoading } = useAuth()

  const [showPassword, setShowPassword] = useState(false)
  const [showPasswordConfirmation, setShowPasswordConfirmation] =
    useState(false)

  const registerFormConfig = useForm({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      name: '',
      username: '',
      email: '',
      phone_number: '',
      password: '',
      password_confirmation: '',
    },
  })

  const handleRegisterFormSubmit = async (data) => {
    try {
      await register({ body: data })
    } catch (error) {
      toast.error(error?.message || 'Register failed. Please try again.')
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

        {/* Right Side - Register Form */}
        <div className="flex w-full items-start justify-center lg:w-1/2">
          <div className="w-full max-w-md">
            {/* Header */}
            <div className="mb-8">
              <h1 className="mb-2 text-center text-4xl font-bold text-slate-900">
                Create an account
              </h1>
            </div>

            {/* Form */}
            <Form {...registerFormConfig}>
              <form
                onSubmit={registerFormConfig.handleSubmit(
                  handleRegisterFormSubmit
                )}
                className="flex flex-col space-y-4 sm:space-y-5 lg:space-y-6"
              >
                <FormField
                  control={registerFormConfig.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-slate-700">
                        Fullname
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="Enter your fullname"
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
                  control={registerFormConfig.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-slate-700">
                        Username
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="Create your username"
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
                  control={registerFormConfig.control}
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
                  control={registerFormConfig.control}
                  name="phone_number"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-slate-700">
                        Phone Number
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="tel"
                          placeholder="Enter your phone number"
                          {...field}
                          onChange={(e) => {
                            const value = e.target.value
                            if (/^\+?[0-9]*$/.test(value)) {
                              field.onChange(value)
                            }
                          }}
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
                  control={registerFormConfig.control}
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

                <FormField
                  control={registerFormConfig.control}
                  name="password_confirmation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-slate-700">
                        Password Confirmation
                      </FormLabel>
                      <FormControl>
                        <div className="group relative">
                          <Input
                            type={
                              showPasswordConfirmation ? 'text' : 'password'
                            }
                            placeholder="Enter your password confirmation"
                            {...field}
                            disabled={isAuthLoading}
                            className="w-full rounded-lg border border-slate-300 px-4 py-3 pr-10 focus:border-slate-400 focus:ring-1 focus:ring-slate-300 focus:outline-none"
                            required
                          />
                          <button
                            disabled={isAuthLoading}
                            type="button"
                            className="absolute inset-y-0 right-0 flex w-8 items-center pr-3 text-[#8E8E8E]"
                            onClick={() =>
                              setShowPasswordConfirmation((prev) => !prev)
                            }
                          >
                            {showPasswordConfirmation ? (
                              <EyeIcon />
                            ) : (
                              <EyeOffIcon />
                            )}
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
                    {isAuthLoading ? 'Registering...' : 'Register'}
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
