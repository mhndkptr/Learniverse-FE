import { ArrowUpDown } from 'lucide-react'

export default function SortDropdown({ sortConfig, onSortChange, options }) {
  return (
    <div className="relative">
      <select
        className="border-input focus:ring-ring h-10 cursor-pointer appearance-none rounded-md border bg-white pr-8 pl-3 text-sm focus:ring-1 focus:outline-none"
        onChange={(e) => {
          const [key, direction] = e.target.value.split(':')
          onSortChange({ key, direction })
        }}
        value={`${sortConfig.key}:${sortConfig.direction}`}
      >
        <option value=":none" disabled>
          Sort By
        </option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      <ArrowUpDown
        size={14}
        className="pointer-events-none absolute top-3 right-2 text-gray-400"
      />
    </div>
  )
}
