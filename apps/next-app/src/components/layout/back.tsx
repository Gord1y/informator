'use client'

import { useRouter } from 'next/navigation'

import { Button } from '../ui/button'

const Back = () => {
  const { back } = useRouter()

  return (
    <Button variant={'destructive'} size={'lg'} onClick={() => back()}>
      <svg
        className='text-foreground mr-2 h-4 w-4'
        fill='none'
        viewBox='0 0 24 24'
        stroke='currentColor'
      >
        <path
          strokeLinecap='round'
          strokeLinejoin='round'
          strokeWidth={2}
          d='M15 19l-7-7 7-7'
        />
      </svg>
      Go Back
    </Button>
  )
}

export default Back
