import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Stock Analyzer Pro',
  description: 'Advanced AI-powered stock analysis platform',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-theme="business">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  )
}