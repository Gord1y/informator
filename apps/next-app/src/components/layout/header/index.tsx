'use client'

import Link from 'next/link'

import Section from '../section'

import HeaderMenu from './menu'
// import Notifications from './notifications'
import { useAuth } from '@/contexts/auth-context'

const Header: React.FC = () => {
  const { currentUser } = useAuth()

  return (
    <header className='border-border bg-background fixed top-0 z-10 flex h-14 w-full items-center justify-center border-b shadow-sm shadow-black dark:shadow-white'>
      <Section className='mx-6 flex w-full flex-row items-center justify-between gap-4'>
        <Link
          href='/'
          className='h-fit w-fit text-lg font-semibold md:text-xl xl:text-2xl'
        >
          Informator
        </Link>
        <div className='flex flex-row gap-2'>
          {/* {currentUser && currentUser.authorized && currentUser.user && (
            <Notifications user={currentUser.user} />
          )} */}
          <HeaderMenu currentUser={currentUser} />
        </div>
      </Section>
    </header>
  )
}

export default Header
