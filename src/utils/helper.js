/**
 * Mengenkripsi string dengan mengubahnya menjadi format Base64 yang aman untuk URL.
 *
 * @param {string} value - String yang akan dienkripsi.
 * @returns {string} - String yang telah dienkripsi dalam format Base64 yang aman untuk URL.
 *
 * @example
 * encryptIt("Hello World!"); // Mengembalikan "SGVsbG8gV29ybGQh"
 */
export function encryptIt(value) {
  // Encode string to Base64 and make it URL-safe
  return btoa(value).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

/**
 * Mendekripsi string yang telah dienkripsi dalam format Base64 yang aman untuk URL.
 *
 * @param {string} encryptedValue - String yang telah dienkripsi dalam format Base64 yang aman untuk URL.
 * @returns {string} - String asli sebelum dienkripsi.
 *
 * @example
 * decryptIt("SGVsbG8gV29ybGQh"); // Mengembalikan "Hello World!"
 */
export function decryptIt(encryptedValue) {
  // Decode URL-safe Base64 back to original Base64
  const base64 = encryptedValue.replace(/-/g, '+').replace(/_/g, '/')
  return atob(base64)
}

/**
 * Mengambil nilai dari objek bertingkat berdasarkan jalur yang diberikan.
 *
 * @param {Object} obj - Objek yang ingin diakses.
 * @param {string} path - Jalur ke nilai yang diinginkan (misalnya, 'customer.name').
 * @returns {*} - Nilai yang ditemukan di jalur yang ditentukan, atau undefined jika jalur tidak ditemukan.
 *
 * @example
 * const data = { customer: { name: "John Doe" } };
 * const customerName = getValueByPath(data, 'customer.name'); // Mengembalikan "John Doe"
 */
export function getObjValueByPath(obj, path) {
  return path.split('.').reduce((o, key) => {
    return (o || {})[key]
  }, obj)
}

/**
 * Mengubah nilai dalam objek bertingkat berdasarkan jalur yang diberikan.
 *
 * @param {Object} obj - Objek yang ingin dimodifikasi.
 * @param {string} path - Jalur ke nilai yang ingin diubah (misalnya, 'customer.name').
 * @param {*} value - Nilai baru yang ingin ditetapkan.
 *
 * @example
 * const data = { customer: { name: "John Doe" } };
 * setValueByPath(data, 'customer.name', 'Jane Smith');
 * getValueByPath(data, 'customer.name') // Mengembalikan "Jane Smith"
 */
export function setObjValueByPath(obj, path, value) {
  const keys = path.split('.')
  keys.reduce((o, key, index) => {
    if (index === keys.length - 1) {
      o[key] = value
    }
    return (o[key] = o[key] || {})
  }, obj)
}

/**
 * Mengambil dua inisial dari nama yang diberikan.
 * Jika nama terdiri dari satu kata, huruf pertama dari kata tersebut akan digunakan dua kali.
 * Jika nama terdiri dari lebih dari satu kata, huruf pertama dari kata pertama dan kedua akan diambil.
 *
 * @param {string} name - Nama yang akan diambil inisialnya. Harus terdiri dari minimal satu kata.
 * @returns {string} - Dua huruf inisial dari nama yang diberikan.
 *
 * @example
 * getTwoInitials("John Doe"); // Mengembalikan "JD"
 * getTwoInitials("Alice");    // Mengembalikan "AA"
 * getTwoInitials("Alice Wonderland"); // Mengembalikan "AW"
 */
export function getTwoInitials(name) {
  const words = name.split(' ')
  const firstInitial = words[0].charAt(0).toUpperCase()
  const secondInitial =
    words.length > 1 ? words[1].charAt(0).toUpperCase() : firstInitial
  const initials = firstInitial + secondInitial
  return initials
}

/**
 * Format angka menjadi format mata uang.
 * @param {number} amount - Angka yang akan diformat.
 * @param {string} currency - Kode mata uang (misalnya, 'USD', 'IDR', 'EUR').
 * @param {string} locale - Locale untuk format (misalnya, 'en-US', 'id-ID').
 * @returns {string} - Angka yang diformat sebagai mata uang.
 */
export const formatCurrency = (amount, currency = 'IDR', locale = 'id-ID') => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

export function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}
