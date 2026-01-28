import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'TeachMaster - DomisLink Empire',
  description: 'Gamified education with 30 AI characters for West African curriculum.',
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