import Link from 'next/link'

import Back from '@/components/layout/back'
import Section from '@/components/layout/section'
import { buttonVariants } from '@/components/ui/button'

export default function NotFound() {
  return (
    <Section
      className='my-4 flex flex-col items-center justify-center gap-2 md:my-8 lg:my-12'
      disableMaxWidth
    >
      <svg
        className='h-64 w-64'
        viewBox='0 0 512 512'
        fill='none'
        xmlns='http://www.w3.org/2000/svg'
      >
        <circle cx='256' cy='256' r='256' fill='#E2E8F0' />
        <path
          d='M331.31 331.31C342.609 320.02 342.609 302.98 331.31 291.69L291.69 252.07L331.31 212.45C342.609 201.16 342.609 184.12 331.31 172.83C320.02 161.54 302.98 161.54 291.69 172.83L252.07 212.45L212.45 172.83C201.16 161.54 184.12 161.54 172.83 172.83C161.54 184.12 161.54 201.16 172.83 212.45L212.45 252.07L172.83 291.69C161.54 302.98 161.54 320.02 172.83 331.31C184.12 342.6 201.16 342.6 212.45 331.31L252.07 291.69L291.69 331.31C302.98 342.6 320.02 342.6 331.31 331.31Z'
          fill='#A0AEC0'
        />
      </svg>
      <h1 className='text-center text-xl font-bold md:text-5xl'>
        404 - Page Not Found
      </h1>
      <p className='text-foreground/50 text-center text-sm md:text-base'>
        Sorry, the page you are looking for does not exist. It might have been
        removed, had its name changed, or is temporarily unavailable.
      </p>
      <div className='flex flex-row flex-wrap gap-2'>
        <Back />
        <Link
          href='/'
          className={buttonVariants({ variant: 'default', size: 'lg' })}
        >
          Go to Home
        </Link>
      </div>
    </Section>
  )
}
