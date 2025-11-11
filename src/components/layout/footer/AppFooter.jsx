export default function AppFooter() {
  return (
    <footer className="bg-bluePrimary-500 w-full shadow-inner">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <p className="text-center text-gray-500 dark:text-gray-400">
          &copy; {new Date().getFullYear()} Learniverse. All rights reserved.
        </p>
      </div>
    </footer>
  )
}
