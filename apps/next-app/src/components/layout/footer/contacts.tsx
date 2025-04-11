import Link from 'next/link'

import { cn } from '@/lib/utils'

interface Props {
  className?: string
  title?: string
}

const Contacts: React.FC<Props> = ({ title, className }) => {
  return (
    <div className={cn('flex w-full flex-col', className)}>
      {title && <h1 className='mb-5 text-lg font-semibold'>{title}</h1>}
      <div className='flex flex-col gap-1 text-[14px] font-medium'>
        <Link href={'/contact-us'} className='font-semibold underline'>
          Working hours
        </Link>
        <p>Monday: 12pm - 10pm</p>
        <p>Other days: 10am - 10pm</p>
        <br />
        <Link href={`tel:+${'380631234567'}`} target='_blank'>
          +38(063) 123-45-67
        </Link>
        <Link href={`tel:+${'380631234567'}`} target='_blank'>
          +38(063) 123-45-67
        </Link>
        <Link href={`mailto:${'support@informator.com'}`} target='_blank'>
          support@informator.com
        </Link>
      </div>
    </div>
  )
}

export default Contacts
