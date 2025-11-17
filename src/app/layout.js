import { Inter } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '@/contexts/auth.context'
import { Toaster } from 'sonner'

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
})

export const metadata = {
  title: 'Learniverse',
  description: 'A platform for learning and collaboration',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} antialiased`}>
        <Toaster position="top-right" richColors expand={false} />
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  )
}
