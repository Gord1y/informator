'use client';

import { useSearchParams } from 'next/navigation';



import AuthoGoogleCallbackComponent from './_components/component';





export default function GoogleCallbackPage() {
  const searchParams = useSearchParams()

  const code = searchParams.get('code')
  const state = searchParams.get('state')

  if (!code) {
    throw new Error(
      'Google callback page must have a code query parameter. Try again.'
    )
  }

  return <AuthoGoogleCallbackComponent code={code} state={state} />
}