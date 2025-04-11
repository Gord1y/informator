'use client'

import Link from 'next/link'
import React, { useEffect } from 'react'

import Section from '@/components/layout/section'
import { Button, buttonVariants } from '@/components/ui/button'

export default function Error({
  error,
  reset
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // eslint-disable-next-line no-console
    console.error(error.message, error.stack)
  }, [error])

  return (
    <Section
      className='my-4 flex flex-col items-center justify-center gap-2 md:my-8 lg:my-12'
      disableMaxWidth
    >
      <svg
        className='h-64 w-64'
        viewBox='0 0 64 64'
        fill='none'
        xmlns='http://www.w3.org/2000/svg'
      >
        <circle cx='32' cy='32' r='30' fill='#F87171' />
        <path
          d='M32 18V34'
          stroke='white'
          strokeWidth='4'
          strokeLinecap='round'
        />
        <circle cx='32' cy='44' r='2' fill='white' />
      </svg>

      <h1 className='text-center text-xl font-bold md:text-5xl'>
        Oops! {error.message || 'Щось пішло не так'}
      </h1>
      <p className='text-foreground/50 text-center text-sm md:text-base'>
        Try refreshing the page or going back to the previous page.
      </p>
      <div className='flex flex-row flex-wrap gap-2'>
        <Button onClick={() => reset()} variant={'destructive'} size={'lg'}>
          Refresh Page
        </Button>
        <Link
          href='/'
          className={buttonVariants({
            variant: 'default',
            size: 'lg'
          })}
        >
          Go to Home
        </Link>
      </div>
    </Section>
  )
}
