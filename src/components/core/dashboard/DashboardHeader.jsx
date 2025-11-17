export default function DashboardHeader() {
  return (
    <div className="bg-amber-700 px-4 py-8 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <h1 className="mb-2 text-3xl font-bold md:text-4xl">
          Welcome Back, Muhammad Hendika Putra!
        </h1>
        <p className="mb-6 text-amber-100">Your Learning Journey Awaits</p>
        <button className="rounded bg-slate-900 px-6 py-2 text-white transition-colors hover:bg-slate-800">
          Enroll New Course
        </button>
      </div>
    </div>
  )
}
