import type { Metadata } from 'next'
import './globals.css'
import ConfigureAmplify from '@/components/ConfigureAmplify'
import Navbar from '@/components/Navbar'

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
      <body>
        <ConfigureAmplify />
        <Navbar />
        {children}
      </body>
    </html>
  )
}
