import { Metadata } from 'next'

import Heading from '@/components/layout/heading'
import Section from '@/components/layout/section'

export const metadata: Metadata = {
  title: 'Contact Us',
  description: 'Contact Us'
}

export default function ContactUsPage() {
  return (
    <Section disableMaxWidth className='flex flex-col gap-2'>
      <Heading>Support</Heading>
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec
        efficitur, nunc et bibendum facilisis, nisi nunc tincidunt nunc, nec
        efficitur nunc nisi nec nunc. Donec efficitur, nunc et bibendum
        facilisis, nisi nunc tincidunt nunc, nec efficitur nunc nisi nec nunc.
      </p>
    </Section>
  )
}
