'use client'

export default function ReadonlyField({ label, value }) {
  return (
    <div className="space-y-1">
      <p className="text-sm font-medium text-gray-800">{label}</p>
      <input
        type="text"
        value={value || '-'}
        disabled
        className="w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-700 shadow-inner"
      />
    </div>
  )
}
