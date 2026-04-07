// Portfolio route group layout — Navbar + Footer + EasterEgg
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import EasterEggListener from '@/components/easter-egg/EasterEggListener'

export default function PortfolioLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Navbar />
      <EasterEggListener />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  )
}
