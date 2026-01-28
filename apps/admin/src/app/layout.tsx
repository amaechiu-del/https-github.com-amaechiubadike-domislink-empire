import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Admin Panel - DomisLink Empire',
  description: 'AI-powered admin panel for managing the DomisLink ecosystem.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}