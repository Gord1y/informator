'use client'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useState } from 'react'

import Heading from '@/components/layout/heading'
import Section from '@/components/layout/section'
import { Button, buttonVariants } from '@/components/ui/button'

import Finalize from './finalize'
import Login from './login'
import Register from './register'
import { cn } from '@/lib/utils'

const AuthComponent: React.FC = () => {
  const [step, setStep] = useState<0 | 1>(0)
  const [email, setEmail] = useState<string>('')
  const [type, setType] = useState<'login' | 'register'>('register')
  const searchParams = useSearchParams()
  const redirect = searchParams.get('redirect') || null

  return (
    <Section disableMaxWidth className='mt-5 max-w-screen-sm items-center'>
      <Heading className='text-center'>
        {step === 0 ? 'Авторизація' : 'Підтвердження'}
      </Heading>
      <p className='text-center font-semibold xl:text-lg'>
        {step === 0
          ? type === 'login'
            ? 'Введіть свій email для авторизації'
            : 'Введіть свій email для реєстрації'
          : 'Лист з кодом OTP відправлено на ваш email'}
      </p>
      {step === 0 && (
        <section className='flex w-full max-w-screen-sm flex-col gap-1 md:gap-2'>
          {type === 'login' ? (
            <Login setStep={setStep} setEmail={setEmail} />
          ) : (
            <Register setStep={setStep} setEmail={setEmail} />
          )}
          <Link
            href={
              redirect ? `/auth/google?redirect=${redirect}` : '/auth/google'
            }
            className={cn(buttonVariants({ variant: 'outline', size: 'lg' }))}
          >
            <svg
              role='img'
              viewBox='0 0 24 24'
              xmlns='http://www.w3.org/2000/svg'
              className='mr-2'
            >
              <title>Google</title>
              <path d='M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z' />
            </svg>
            Авторизація через Google
          </Link>
          {type === 'login' ? (
            <Button
              variant={'ghost'}
              size={'lg'}
              className='gap-2'
              onClick={() => setType('register')}
            >
              Немає аккаунту? <b className='text-primary'>Зареєструватися</b>
            </Button>
          ) : (
            <Button
              variant={'ghost'}
              size={'lg'}
              className='gap-2'
              onClick={() => setType('login')}
            >
              Вже є аккаунт? <b className='text-primary'>Увійти</b>
            </Button>
          )}
        </section>
      )}
      {step === 1 && <Finalize type={type} email={email} setStep={setStep} />}
    </Section>
  )
}

export default AuthComponent
