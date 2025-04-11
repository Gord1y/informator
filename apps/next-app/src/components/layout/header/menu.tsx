'use client'

import { Menu, User } from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'

import LogoutButton from './logout-button'
import ThemeSwither from './theme-switcher'
import { ICurrentUser } from '@/interfaces/user/user.interface'
import { GetImageUrl } from '@/lib/get-image-url'

interface Props {
  currentUser: ICurrentUser
}

const HeaderMenu: React.FC<Props> = ({ currentUser }) => {
  const { push } = useRouter()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {currentUser && currentUser.authorized && currentUser.user ? (
          <Button variant={'ghost'} size={'sm'} className='space-x-2'>
            {currentUser.user.avatar ? (
              <Image
                src={GetImageUrl(currentUser.user.avatar)}
                alt='user-avatar'
                className='flex h-8 w-8 items-center justify-center rounded-full border-2 border-border bg-card'
                width={32}
                height={32}
              />
            ) : (
              <span className='flex h-8 w-8 items-center justify-center rounded-full border-2 border-border bg-card'>
                <User className='h-6 w-6 text-primary' />
              </span>
            )}
            <p className='text-lg font-bold md:text-xl'>
              {`${currentUser.user.firstName} ${currentUser.user.lastName?.charAt(0).toUpperCase()}`}
              .
            </p>
          </Button>
        ) : (
          <Button variant='outline' size='icon'>
            <Menu className='h-6 w-6' />
          </Button>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent className='w-56'>
        <DropdownMenuLabel>Menu</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => push('/')}>Home</DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <ThemeSwither />
        <DropdownMenuSeparator />
        <DropdownMenuLabel>
          {currentUser && currentUser.authorized && currentUser.user
            ? 'User Menu'
            : 'Guest Menu'}
        </DropdownMenuLabel>
        {currentUser && currentUser.authorized && currentUser ? (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={() => push('/dashboard')}>
                Dashboard
              </DropdownMenuItem>
              <LogoutButton />
            </DropdownMenuGroup>
          </>
        ) : (
          <DropdownMenuItem onClick={() => push('/auth')} className='mt-1 p-0'>
            <Button variant='default' className='w-full'>
              Login
            </Button>
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default HeaderMenu
