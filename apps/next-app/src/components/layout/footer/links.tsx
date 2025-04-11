import Link from 'next/link'

import { CONTACTS_LINKS } from '@/config/contacts'

import { cn } from '@/lib/utils'

interface Props {
  title?: string
  className?: string
}

const Links: React.FC<Props> = ({ title, className }) => {
  return (
    <div className={cn('flex w-full flex-col', className)}>
      {title && <h1 className='mb-5 text-lg font-semibold'>{title}</h1>}
      <div className='flex flex-wrap items-center justify-evenly'>
        {CONTACTS_LINKS.map((link, index) => (
          <Link
            key={index}
            href={link.href}
            className='h-fit w-14'
            target='_blank'
          >
            {link.svg}
          </Link>
        ))}
      </div>
    </div>
  )
}

export default Links
