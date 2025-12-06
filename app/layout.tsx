import type { Metadata } from 'next'
import './globals.css'
import ConfigureAmplify from '@/components/ConfigureAmplify'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

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
    <html lang="en" suppressHydrationWarning>
      <body className="flex flex-col min-h-screen">
        <ConfigureAmplify />
        <Navbar />
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}
