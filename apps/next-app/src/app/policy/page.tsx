import { Metadata } from 'next'
import Link from 'next/link'

import Heading from '@/components/layout/heading'
import Section from '@/components/layout/section'

export const metadata: Metadata = {
  title: 'Policy',
  description: 'Policy'
}

export default function PolicyPage() {
  return (
    <Section disableMaxWidth className='flex flex-col gap-2'>
      <Heading>Lorem ipsum</Heading>
      <div className='flex flex-col gap-2 self-start'>
        <p>
          <b>Lorem ipsum dolor sit amet</b>
          <Link
            href='https://informator.com'
            className='text-primary font-semibold'
          >
            informator.com
          </Link>
          .
        </p>
        <p>
          <b>Lorem ipsum dolor sit amet</b>
          <Link
            href='https://informator.com'
            className='text-primary font-semibold'
          >
            informator.com
          </Link>
          .
        </p>
      </div>
      <div className='mt-5 flex flex-col gap-5 self-start'>
        <b>1. Lorem ipsum</b>
        <div className='text-sm'>
          1.1. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec
          adipiscing amet
          <br />
          1.2. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec
          adipiscing amet
          <br />
          1.3. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec
          adipiscing amet
          <br />
          1.4. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec
          adipiscing amet
        </div>
      </div>
    </Section>
  )
}
