import AppFooter from '@/components/layout/footer/AppFooter'
import AppHeader from '@/components/layout/header/AppHeader'

export default function FrontlinerLayout({ children }) {
  return (
    <>
      <AppHeader />
      <div className="relative flex min-h-screen flex-col justify-between bg-white">
        {children}
        <AppFooter />
      </div>
    </>
  )
}
