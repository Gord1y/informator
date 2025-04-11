import Link from 'next/link'

import { PAGES } from '@/config/pages'

import { cn } from '@/lib/utils'

interface Props {
  className?: string
  title?: string
}

const Pages: React.FC<Props> = ({ title, className }) => {
  return (
    <div className={cn('flex w-full flex-col', className)}>
      {title && <h1 className='mb-5 text-lg font-semibold'>{title}</h1>}
      <div className='flex flex-col gap-0.5'>
        {PAGES.filter(val => val.isFooter).map((link, index) => (
          <Link
            key={index}
            href={link.href}
            className='text-dark text-[15px] font-medium transition-all hover:text-primary'
          >
            {link.name}
          </Link>
        ))}
      </div>
    </div>
  )
}

export default Pages
