import type { Metadata } from 'next'
import { Geist_Mono } from 'next/font/google'
import { cookies } from 'next/headers'

import Layout from '@/components/layout'

import { cookiesConstant } from '@/config/cookies.constants'

import './globals.css'
import { ICurrentUser } from '@/interfaces/user/user.interface'

const font = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin']
})

export const metadata: Metadata = {
  title: {
    default: 'Informator - try your stream',
    template: '%s | Informator'
  },
  description: 'Informator - інтернет магазин дитячих іграшок',
  manifest: '/site.webmanifest',
  applicationName: 'Informator',
  appleWebApp: {
    capable: true,
    title: 'Informator',
    statusBarStyle: 'black-translucent'
  },
  icons: {
    apple: '/icons/apple-touch-icon.png'
  },
  creator: 'Informator',
  authors: [{ name: 'Gord1y', url: 'https://gord1y.dev/' }],
  keywords: 'informator.com',
  other: {
    'mobile-web-app-capable': 'yes',
    'msapplication-tap-highlight': 'no'
  },
  metadataBase: new URL(String(process.env.NEXT_PUBLIC_APP_URL)),
  alternates: {
    canonical: process.env.NEXT_PUBLIC_APP_URL
  },
  openGraph: {
    type: 'website',
    siteName: 'informator.com',
    emails: ['admin@informator.com'],
    locale: 'en_US',
    url: process.env.NEXT_PUBLIC_APP_URL,
    title: '',
    description: '',
    images: [
      {
        url: `${process.env.NEXT_PUBLIC_APP_URL}/icons/icon512_maskable.png`,
        width: 512,
        height: 512,
        alt: ''
      }
    ]
  },
  formatDetection: {
    telephone: true
  }
}

const getCurrentUser = async (): Promise<ICurrentUser> => {
  const cookieStore = await cookies()
  const cookie = cookieStore.get(cookiesConstant.currentUser)
  return cookie ? JSON.parse(cookie.value) : { authorized: false, user: null }
}

export default async function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  const currentUser = await getCurrentUser()

  return (
    <html lang='en' suppressHydrationWarning>
      <body className={`${font.variable} antialiased`}>
        <Layout currentUser={currentUser}>{children}</Layout>
      </body>
    </html>
  )
}
