'use client'

import { useSearchParams } from 'next/navigation'

import AuthoGoogleCallbackComponent from './_components/component'

export default function GoogleCallbackPage() {
  const searchParams = useSearchParams()

  const code = searchParams.get('code')
  const state = searchParams.get('state')

  if (!code) {
    throw new Error(
      'Сталася помилка авторизації через Google. Спробуйте ще раз.'
    )
  }

  return <AuthoGoogleCallbackComponent code={code} state={state} />
}
