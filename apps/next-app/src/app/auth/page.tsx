import AuthComponent from './_components'

export function generateMetadata() {
  return {
    title: 'Auth Page',
    description: 'Athentication page for the application'
  }
}

export default function AuthPage() {
  return <AuthComponent />
}
