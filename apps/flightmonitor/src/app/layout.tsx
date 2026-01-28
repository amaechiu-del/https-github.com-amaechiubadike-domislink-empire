import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Flight Monitor - DomisLink Empire',
  description: 'Track flights worldwide with real-time updates and community forums.',
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