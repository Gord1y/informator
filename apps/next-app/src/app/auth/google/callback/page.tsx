import AuthoGoogleCallbackComponent from './_components/component'

interface GoogleCallbackParams {
  code?: string
  state?: string
}

export default async function GoogleCallbackPage({
  params
}: {
  params: GoogleCallbackParams
}) {
  const { code, state } = await params

  if (!code) {
    throw new Error(
      'Сталася помилка авторизації через Google. Спробуйте ще раз.'
    )
  }

  return <AuthoGoogleCallbackComponent code={code} state={state} />
}
