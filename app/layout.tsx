import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import ToasterContext from './context/ToasterContext'
import AuthContext from './context/AuthContext'
import ActiveStatus from './components/ActiveStatus'
const inter = Inter({ subsets: ['latin'] })
export const metadata: Metadata = {
  title: 'Chat-Web',
  description: 'Create Chat-Web by NextJs',
  icons: {
    icon: '/images/chat-logo.png',
  },
}
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <AuthContext>
          <ToasterContext />
          <ActiveStatus />
          {children}
        </AuthContext>
      </body>
    </html>
  )
}
