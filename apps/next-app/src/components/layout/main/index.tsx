import { PropsWithChildren } from 'react'

import Footer from '../footer'
import Section from '../section'

const Main: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <Section
      as='main'
      className='relative top-14 flex h-[calc(100svh-56px)] w-full flex-col gap-2 pt-2 lg:gap-5'
    >
      {children}
      <Footer />
    </Section>
  )
}

export default Main
