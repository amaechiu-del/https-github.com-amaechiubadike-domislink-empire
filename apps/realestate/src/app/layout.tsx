import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'DomisLink Real Estate',
  description: 'Find your perfect property with DomisLink Real Estate',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
