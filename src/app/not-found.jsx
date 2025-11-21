'use client'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import Link from 'next/link'

export default function NotFoundPage() {
  return (
    <section className="bg-bluePrimary-500">
      <div className="container mx-auto min-h-screen px-6 py-12 lg:flex lg:items-center lg:gap-12">
        <div className="w-full lg:w-1/2">
          <p className="text-sm font-medium text-white">404 error</p>
          <h1 className="mt-3 text-2xl font-semibold text-white md:text-3xl">
            Page not found
          </h1>
          <p className="mt-4 text-gray-300">
            Sorry, the page you are looking for doesn't exist.
          </p>

          <div className="mt-6 flex items-center gap-x-3">
            <Button variant={'subtle'} onClick={() => window.history.back()}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="h-5 w-5 rtl:rotate-180"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6.75 15.75L3 12m0 0l3.75-3.75M3 12h18"
                />
              </svg>
              <span>Go back</span>
            </Button>

            <Link href="/">
              <Button
                variant="outline"
                className={
                  'bg-bluePrimary-500 hover:text-bluePrimary-500! border-white! text-white! hover:border-white hover:bg-white'
                }
              >
                Take me home
              </Button>
            </Link>
          </div>
        </div>

        <div className="relative mt-12 w-full lg:mt-0 lg:w-1/2">
          <Image
            className="w-full max-w-lg lg:mx-auto"
            src="/assets/images/img-404-illustration.svg"
            alt="404 Illustration"
            width={500}
            height={500}
            priority
          />
        </div>
      </div>
    </section>
  )
}
