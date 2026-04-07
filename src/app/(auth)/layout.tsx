// Auth route group layout — full-screen centered, dark background, no nav
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a]">
      {children}
    </div>
  )
}
