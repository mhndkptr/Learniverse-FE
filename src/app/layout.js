import { Inter } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '@/contexts/auth.context'
import { Toaster } from 'sonner'
import ReactQueryClientProvider from '../components/config/ReactQueryClientProvider'
import NextTopLoader from 'nextjs-toploader'

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
        <NextTopLoader
          color="#0a2052"
          initialPosition={0.08}
          crawlSpeed={200}
          height={3}
          crawl={true}
          showSpinner={false}
          easing="ease"
          speed={200}
          shadow="0 0 10px #1e55af,0 0 5px #1e55af"
          template='<div class="bar" role="bar"><div class="peg"></div></div> 
  <div class="spinner" role="spinner"><div class="spinner-icon"></div></div>'
          zIndex={99999999}
          showAtBottom={false}
        />

        <Toaster position="top-right" richColors expand={false} />

        <ReactQueryClientProvider>
          <AuthProvider>{children}</AuthProvider>
        </ReactQueryClientProvider>
      </body>
    </html>
  )
}
