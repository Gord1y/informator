'use client'

import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'

import { Button } from '@/components/ui/button'
import { DropdownMenuItem } from '@/components/ui/dropdown-menu'

import { useAuth } from '@/contexts/auth-context'
import { authService } from '@/services/auth.service'

const LogoutButton: React.FC = () => {
  const { push } = useRouter()
  const { logout } = useAuth()

  const { mutate, isPending } = useMutation({
    mutationKey: ['logout'],
    mutationFn: async () => authService.logout(logout),
    onSuccess: () => {
      push('/')
    }
  })

  return (
    <DropdownMenuItem onClick={() => mutate()} className='mt-1 p-0'>
      <Button
        variant={'destructive'}
        className='w-full'
        onClick={() => mutate()}
      >
        {isPending ? 'Завантаження...' : 'Вийти'}
      </Button>
    </DropdownMenuItem>
  )
}

export default LogoutButton
