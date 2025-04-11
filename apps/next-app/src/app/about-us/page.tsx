import { Metadata } from 'next'

import Heading from '@/components/layout/heading'
import Section from '@/components/layout/section'

export const metadata: Metadata = {
  title: 'About Us',
  description: 'About Us'
}

export default function AboutUsPage() {
  return (
    <Section disableMaxWidth>
      <Heading>About Us</Heading>
      <div className='mt-10 flex w-full flex-col gap-5'>
        <h3>
          <b className='text-primary font-bold'>informator</b> - it&apos;s new
          place for your streams.
        </h3>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec
          efficitur, nunc et bibendum facilisis, nisi nunc tincidunt nunc, nec
          efficitur nunc nisi nec nunc. Donec efficitur, nunc et bibendum
          facilisis, nisi nunc tincidunt nunc, nec efficitur nunc nisi nec nunc.
        </p>
      </div>
    </Section>
  )
}
