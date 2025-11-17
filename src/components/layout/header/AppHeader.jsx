import { Button } from '@/components/ui/button'
import Image from 'next/image'
import Link from 'next/link'

export default function AppHeader() {
  return (
    <header className="relative w-full">
      <nav className="fixed top-0 right-0 left-0 z-50 bg-white shadow-[0_3px_5px_rgba(0,0,0,0.1)]">
        <div className="mx-auto flex max-w-[85vw] flex-wrap items-center justify-between py-1">
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
            <button
              data-collapse-toggle="navbar-default"
              type="button"
              className="inline-flex h-10 w-10 items-center justify-center rounded-lg p-2 text-sm text-gray-500 hover:bg-gray-100 focus:ring-2 focus:ring-gray-200 focus:outline-none md:hidden dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
              aria-controls="navbar-default"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
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
            </button>
            <div
              className="hidden w-full md:block md:w-auto"
              id="navbar-default"
            >
              <ul className="mt-4 flex flex-col rounded-lg border border-gray-100 bg-gray-50 p-4 font-medium md:mt-0 md:flex-row md:space-x-14 md:border-0 md:bg-white md:p-0 rtl:space-x-reverse dark:border-gray-700 dark:bg-gray-800 md:dark:bg-gray-900">
                <li>
                  <a
                    href="#"
                    className="block rounded-sm bg-neutral-500 px-3 py-2 font-bold text-neutral-500 md:bg-transparent md:p-0 md:text-neutral-500"
                    aria-current="page"
                  >
                    Home
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="block rounded-sm px-3 py-2 text-gray-900 hover:bg-gray-100 md:border-0 md:p-0 md:hover:bg-transparent md:hover:text-neutral-500"
                  >
                    Courses
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="block rounded-sm px-3 py-2 text-gray-900 hover:bg-gray-100 md:border-0 md:p-0 md:hover:bg-transparent md:hover:text-neutral-500"
                  >
                    Mentors
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="space-x-3">
            <Button variant="secondary" className="hidden md:inline-block">
              Register
            </Button>
            <Button variant="primary" className="hidden md:inline-block">
              Login
            </Button>
          </div>
        </div>
      </nav>
    </header>
  )
}