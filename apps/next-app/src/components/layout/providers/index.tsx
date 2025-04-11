'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { Analytics } from '@vercel/analytics/next'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { PropsWithChildren, useState } from 'react'

import { Toaster } from '@/components/ui/sonner'

import { ThemeProvider } from './theme'
import { AuthProvider } from '@/contexts/auth-context'
import { ICurrentUser } from '@/interfaces/user/user.interface'

interface Props {
  currentUser: ICurrentUser
}

const Providers: React.FC<PropsWithChildren<Props>> = ({
  children,
  currentUser
}) => {
  const [client] = useState(
    new QueryClient({
      defaultOptions: {
        queries: {
          refetchOnWindowFocus: false
        }
      }
    })
  )

  return (
    <>
      <QueryClientProvider client={client}>
        <AuthProvider initalState={currentUser}>
          <ThemeProvider
            attribute='class'
            defaultTheme='light'
            disableTransitionOnChange
          >
            {children}
            <Toaster />
            <Analytics />
            <SpeedInsights />
            <ReactQueryDevtools initialIsOpen={false} />
          </ThemeProvider>
        </AuthProvider>
      </QueryClientProvider>
    </>
  )
}

export default Providers
