import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'GigWheels EV - Electric Vehicle Fleet Management',
  description: 'Premium EV fleet management and rental services',
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
