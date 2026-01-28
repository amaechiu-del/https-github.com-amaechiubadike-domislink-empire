import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'DomisLink Empire - Your Gateway to Everything',
  description: 'One platform for real estate, flights, education, and more. Powered by AI.',
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