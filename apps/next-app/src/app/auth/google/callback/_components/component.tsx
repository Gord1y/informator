'use client'

import { useQuery } from '@tanstack/react-query'
import { Loader } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

import { DASHBOARD_PAGES } from '@/config/pages-url.config'

import { useAuth } from '@/contexts/auth-context'
import { authService } from '@/services/auth.service'

interface Props {
  code: string
  state?: string
}

const AuthoGoogleCallbackComponent: React.FC<Props> = ({ code, state }) => {
  const { login } = useAuth()
  const { push } = useRouter()

  const { data, isLoading } = useQuery({
    queryKey: ['finalize'],
    queryFn: async () => authService.googleCallback(code, login),
    retry: false
  })

  useEffect(() => {
    if (data) {
      const redirectUrl = state
        ? decodeURIComponent(state)
        : DASHBOARD_PAGES.HOME
      push(redirectUrl)
    }
  }, [data, push, state])

  if (isLoading) {
    return (
      <div className='min-h-200px flex w-full items-center justify-center'>
        <Loader className='size-8' />
      </div>
    )
  }

  return null
}

export default AuthoGoogleCallbackComponent
