import AuthComponent from './_components'

export function generateMetadata() {
  return {
    title: 'Сторінка авторизації',
    description: 'Сторінка авторизації',
    keywords: 'авторизація, логін, пароль'
  }
}

export default function AuthPage() {
  return <AuthComponent />
}
