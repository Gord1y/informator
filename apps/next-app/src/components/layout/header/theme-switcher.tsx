'use client'

import { DropdownMenuGroup } from '@radix-ui/react-dropdown-menu'
import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'
import * as React from 'react'

import {
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger
} from '@/components/ui/dropdown-menu'

export default function ThemeSwither() {
  const { setTheme } = useTheme()

  return (
    <DropdownMenuSub>
      <DropdownMenuSubTrigger className='flex w-full flex-row justify-start gap-2'>
        <Sun className='h-6 w-6 dark:hidden' />
        <Moon className='hidden h-6 w-6 dark:block' />
        <p>Select theme:</p>
      </DropdownMenuSubTrigger>
      <DropdownMenuPortal>
        <DropdownMenuSubContent className='p-1 md:p-2'>
          <DropdownMenuGroup>
            <DropdownMenuItem
              onClick={() => setTheme('dark')}
              className='flex items-center justify-between'
            >
              Dark
              <Moon className='h-6 w-6' />
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => setTheme('light')}
              className='flex items-center justify-between'
            >
              Light
              <Sun className='h-6 w-6' />
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuSubContent>
      </DropdownMenuPortal>
    </DropdownMenuSub>
  )
}
