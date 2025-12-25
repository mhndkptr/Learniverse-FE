'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function SideBarProfile({ items = [] }) {
  const pathname = usePathname()

  const normalizePath = (path) => {
    if (!path) return ''
    if (path === '/') return '/'
    return path.replace(/\/+$/, '')
  }

  const isActive = (href) => {
    if (!href) return false
    const current = normalizePath(pathname)
    const target = normalizePath(href)
    return current === target
  }

  return (
    <aside className="w-full max-w-xs space-y-3 self-start rounded-xl bg-gray-50 p-4 shadow-sm md:h-fit md:w-64">
      <h2 className="text-lg font-semibold text-gray-900">Pengaturan</h2>
      <div className="mt-2 flex flex-col gap-2">
        {items.map((item) =>
          item.href ? (
            <Link
              key={item.label}
              href={item.href}
              className={`w-full rounded-lg border px-4 py-2 text-center text-sm font-medium shadow-sm transition ${
                isActive(item.href)
                  ? 'border-[#0E1B50] bg-[#0E1B50] text-white'
                  : 'border-gray-200 bg-white text-gray-800 hover:border-blue-200 hover:bg-blue-50'
              }`}
            >
              {item.label}
            </Link>
          ) : (
            <button
              key={item.label}
              type="button"
              onClick={item.onClick}
              className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-800 shadow-sm transition hover:border-blue-200 hover:bg-blue-50"
            >
              {item.label}
            </button>
          )
        )}
      </div>
    </aside>
  )
}
