import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'TicketMaster - DomisLink Empire',
  description: 'Book flights worldwide with live fares and real-time updates.',
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