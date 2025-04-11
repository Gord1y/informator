import Link from 'next/link'

import { cn } from '@/lib/utils'

interface Props {
  className?: string
}

const Copyright: React.FC<Props> = ({ className }) => {
  return (
    <div
      className={cn('mt-2 flex flex-col items-center gap-1 text-sm', className)}
    >
      <h1 className='w-fit'>
        © {new Date().getFullYear()}{' '}
        <Link
          href='https://graverse.com.ua'
          className='text-primary'
          target='_blank'
        >
          Informator
        </Link>{' '}
        All rights reserved.
      </h1>
    </div>
  )
}

export default Copyright
