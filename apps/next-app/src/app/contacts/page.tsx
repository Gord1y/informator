import { Metadata } from 'next'
import Link from 'next/link'

import Links from '@/components/layout/footer/links'
import Heading from '@/components/layout/heading'
import Section from '@/components/layout/section'
import { buttonVariants } from '@/components/ui/button'


import { cn } from '@/lib/utils'

export const metadata: Metadata = {
  title: 'Contacts',
  description: 'Contacts'
}

export default function ContactsPage() {
  return (
    <Section disableMaxWidth className='flex flex-col gap-2 md:gap-4'>
      <Heading>Contacts</Heading>
      <section className='flex flex-col'>
        <div className='flex gap-2'>
          Main:
          <Link
            href={`tel:${'380631234567'}`}
            className={cn(
              buttonVariants({
                variant: 'link',
                size: 'sm'
              }),
              'h-fit p-0'
            )}
          >
            +38(063) 123-45-67
          </Link>
        </div>
        <div className='flex gap-2'>
          Secondary:
          <Link
            href={`tel:${'380631234567'}`}
            className={cn(
              buttonVariants({
                variant: 'link',
                size: 'sm'
              }),
              'h-fit p-0'
            )}
          >
            {'+38(063) 123-45-67'}
          </Link>
        </div>
      </section>
      <Heading>Our Socials</Heading>
      <Links className='w-fit' />
      <Heading>Working hours</Heading>
      <p>
        Monday <b className='text-primary'>12pm - 10pm</b>
        <br />
        Other days <b className='text-primary'>10am - 12 pm</b>
      </p>
      <Heading>Lorem ipsum</Heading>
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec
        efficitur, nunc et bibendum facilisis, nisi nunc tincidunt nunc, nec
        efficitur nunc nisi nec nunc. Donec efficitur, nunc et bibendum
        facilisis, nisi nunc tincidunt nunc, nec efficitur nunc nisi nec nunc.
      </p>
      <Heading>Lorem ipsum</Heading>
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec
        efficitur, nunc et bibendum facilisis, nisi nunc tincidunt nunc, nec
        efficitur nunc nisi nec nunc. Donec efficitur, nunc et bibendum
        facilisis, nisi nunc tincidunt nunc, nec efficitur nunc nisi nec nunc.
      </p>
    </Section>
  )
}
