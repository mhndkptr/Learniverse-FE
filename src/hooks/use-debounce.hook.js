import { useState, useEffect } from 'react'

export function useDebounce(value, delay) {
  // State untuk menyimpan nilai debounced
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    // Atur timer untuk mengupdate debouncedValue setelah 'delay'
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    // Cleanup function: membatalkan timer jika 'value' atau 'delay' berubah
    // sebelum delay tercapai. Ini penting agar hanya perubahan terakhir yang dijalankan.
    return () => {
      clearTimeout(handler)
    }
  }, [value, delay]) // Hanya re-run jika value atau delay berubah

  return debouncedValue
}
