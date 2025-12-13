'use client'

export default function ProfileLayout({ children }) {
  return (
    <div className="min-h-screen w-full bg-white">
      <main className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-4 pb-16 pt-28 md:flex-row md:gap-12 md:px-8">
        {children}
      </main>
    </div>
  )
}
