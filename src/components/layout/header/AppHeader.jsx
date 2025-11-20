'use client'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Separator } from '@/components/ui/separator'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { useAuth } from '@/contexts/auth.context'
import { ChevronDown } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'

export default function AppHeader() {
  const router = useRouter()
  const pathname = usePathname()
  const { user, logout } = useAuth()

  return (
    <header className="relative w-full">
      <nav className="fixed top-0 right-0 left-0 z-50 bg-white shadow-[0_3px_5px_rgba(0,0,0,0.1)]">
        <div className="mx-auto flex w-full flex-wrap items-center justify-between px-5 py-1 md:px-16">
          <div className="flex items-center space-x-20">
            <Link
              href="/"
              className="flex items-center space-x-3 rtl:space-x-reverse"
            >
              <Image
                src="/assets/images/img-logo-learniverse.png"
                alt="Learniverse Logo"
                width={1280}
                height={1280}
                className="h-16 w-auto"
              />
            </Link>

            <div className="hidden w-full md:block md:w-auto">
              <ul className="mt-4 flex flex-col rounded-lg border border-gray-100 bg-gray-50 p-4 font-medium md:mt-0 md:flex-row md:space-x-14 md:border-0 md:bg-white md:p-0 rtl:space-x-reverse dark:border-gray-700 dark:bg-gray-800 md:dark:bg-gray-900">
                <li>
                  <p
                    onClick={() => router.push('/')}
                    className={`block cursor-pointer rounded-sm ${pathname === '/' ? 'font-bold text-neutral-500' : 'text-gray-900'} px-3 py-2 hover:bg-gray-100 md:border-0 md:p-0 md:hover:bg-transparent md:hover:text-neutral-500`}
                    aria-current="page"
                  >
                    Home
                  </p>
                </li>
                <li>
                  <p
                    onClick={() => router.push('/course')}
                    className={`block cursor-pointer rounded-sm ${pathname === '/course' ? 'font-bold text-neutral-500' : 'text-gray-900'} px-3 py-2 hover:bg-gray-100 md:border-0 md:p-0 md:hover:bg-transparent md:hover:text-neutral-500`}
                  >
                    Courses
                  </p>
                </li>
                <li>
                  <p
                    onClick={() => router.push('/mentor')}
                    className={`block cursor-pointer rounded-sm ${pathname === '/mentor' ? 'font-bold text-neutral-500' : 'text-gray-900'} px-3 py-2 hover:bg-gray-100 md:border-0 md:p-0 md:hover:bg-transparent md:hover:text-neutral-500`}
                  >
                    Mentors
                  </p>
                </li>
              </ul>
            </div>
          </div>

          {user ? (
            <div className="hidden items-center space-x-3 md:flex">
              {user.role === 'ADMIN' ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="primary">
                      {pathname.startsWith('/backoffice')
                        ? 'Backoffice Area'
                        : 'Client Area'}
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-fit" align="start">
                    <DropdownMenuItem
                      className={'cursor-pointer'}
                      onClick={() => router.push('/')}
                    >
                      Client Area
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className={'cursor-pointer'}
                      onClick={() => router.push('/backoffice')}
                    >
                      Backoffice Area
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button
                  variant="primary"
                  onClick={() => router.push('/dashboard')}
                >
                  Dashboard
                </Button>
              )}

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className={'h-12 py-1.5'}>
                    <Image
                      src={
                        user.profile_uri ||
                        '/assets/images/img-avatar-placeholder.png'
                      }
                      alt={user.name}
                      width={48}
                      height={48}
                      className="size-12 rounded-full object-cover"
                    />
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-fit" align="start">
                  <DropdownMenuItem
                    onClick={() => router.push('/my/profile')}
                    className={'cursor-pointer'}
                  >
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => router.push('/my/history/order')}
                    className={'cursor-pointer'}
                  >
                    Order History
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => router.push('/my/history/mentor')}
                    className={'cursor-pointer'}
                  >
                    Mentor History
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={async () => await logout()}
                    className={'cursor-pointer'}
                  >
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <div className="space-x-3">
              <Button
                onClick={() => router.push('/auth/register')}
                variant="secondary"
                className="hidden md:inline-block"
              >
                Register
              </Button>
              <Button
                onClick={() => router.push('/auth/login')}
                variant="primary"
                className="hidden md:inline-block"
              >
                Login
              </Button>
            </div>
          )}

          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className={'aspect-square'}>
                  <svg
                    className="h-5 w-5"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 17 14"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M1 1h15M1 7h15M1 13h15"
                    />
                  </svg>
                </Button>
              </SheetTrigger>
              <SheetContent showCloseButton={false} side="left">
                <SheetHeader className={'pb-0'}>
                  <div className="flex items-center gap-3">
                    <Image
                      src="/assets/images/img-logo-learniverse.png"
                      alt="Learniverse Logo"
                      width={1280}
                      height={1280}
                      className="h-12 w-auto"
                    />
                    <SheetTitle className={'text-xl'}>Learniverse </SheetTitle>
                  </div>
                </SheetHeader>

                <Separator />

                <ul className="flex flex-col space-y-2 rounded-lg px-4 font-medium rtl:space-x-reverse">
                  <li>
                    <p
                      onClick={() => router.push('/')}
                      className={`block cursor-pointer rounded-sm ${pathname === '/' ? 'font-bold text-neutral-500' : 'text-gray-900'} px-3 py-2 hover:bg-gray-100`}
                      aria-current="page"
                    >
                      Home
                    </p>
                  </li>
                  <li>
                    <p
                      onClick={() => router.push('/course')}
                      className={`block cursor-pointer rounded-sm ${pathname === '/course' ? 'font-bold text-neutral-500' : 'text-gray-900'} px-3 py-2 hover:bg-gray-100`}
                    >
                      Courses
                    </p>
                  </li>
                  <li>
                    <p
                      onClick={() => router.push('/mentor')}
                      className={`block cursor-pointer rounded-sm ${pathname === '/mentor' ? 'font-bold text-neutral-500' : 'text-gray-900'} px-3 py-2 hover:bg-gray-100`}
                    >
                      Mentors
                    </p>
                  </li>
                </ul>

                {user && (
                  <>
                    <Separator />

                    <ul className="flex flex-col space-y-2 rounded-lg px-4 font-medium rtl:space-x-reverse">
                      <li>
                        <p
                          onClick={() => router.push('/my/profile')}
                          className={`block cursor-pointer rounded-sm ${pathname.startsWith('/my/profile') ? 'font-bold text-neutral-500' : 'text-gray-900'} px-3 py-2 hover:bg-gray-100`}
                          aria-current="page"
                        >
                          Profile
                        </p>
                      </li>
                      <li>
                        <p
                          onClick={() => router.push('/my/history/order')}
                          className={`block cursor-pointer rounded-sm ${pathname.startsWith('/my/history/order') ? 'font-bold text-neutral-500' : 'text-gray-900'} px-3 py-2 hover:bg-gray-100`}
                        >
                          Order History
                        </p>
                      </li>
                      <li>
                        <p
                          onClick={() => router.push('/my/history/mentor')}
                          className={`block cursor-pointer rounded-sm ${pathname.startsWith('/my/history/mentor') ? 'font-bold text-neutral-500' : 'text-gray-900'} px-3 py-2 hover:bg-gray-100`}
                        >
                          Mentor History
                        </p>
                      </li>
                    </ul>

                    <Separator />
                  </>
                )}

                {user && (
                  <div className="flex flex-col space-y-2 rounded-lg px-4 font-medium">
                    {user.role === 'STUDENT' ? (
                      <Button
                        onClick={() => router.push('/dashboard')}
                        variant="primary"
                        className={'text-left'}
                      >
                        <span className="w-full">Dashboard</span>
                      </Button>
                    ) : (
                      <>
                        <Button
                          onClick={() => router.push('/')}
                          variant="primary"
                          className={'text-left'}
                        >
                          <span className="w-full">Client Area</span>
                        </Button>
                        <Button
                          onClick={() => router.push('/backoffice')}
                          variant="secondary"
                          className={'text-left'}
                        >
                          <span className="w-full">Backoffice Area</span>
                        </Button>
                      </>
                    )}
                  </div>
                )}

                <SheetFooter>
                  {user ? (
                    <SheetClose asChild>
                      <Button
                        onClick={async () => await logout()}
                        variant="destructive"
                      >
                        Logout
                      </Button>
                    </SheetClose>
                  ) : (
                    <>
                      <SheetClose asChild>
                        <Button
                          onClick={() => router.push('/auth/login')}
                          variant="primary"
                        >
                          Login
                        </Button>
                      </SheetClose>
                      <SheetClose asChild>
                        <Button
                          onClick={() => router.push('/auth/register')}
                          variant="secondary"
                        >
                          Register
                        </Button>
                      </SheetClose>
                    </>
                  )}
                  <SheetClose asChild>
                    <Button variant="outline">Close</Button>
                  </SheetClose>
                </SheetFooter>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>
    </header>
  )
}
