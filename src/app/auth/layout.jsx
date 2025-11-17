import AppFooter from '@/components/layout/footer/AppFooter'
import AppHeader from '@/components/layout/header/AppHeader'

export default function AuthLayout({ children }) {
  return (
    <>
      <div className="relative flex min-h-screen flex-col justify-between bg-white">
        <AppHeader />
        {children}
        <AppFooter />
      </div>
    </>
  )
}
