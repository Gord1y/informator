'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import React from 'react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'

import api from '@/services/api'

const BecomeStreamer: React.FC = () => {
  const queryClient = useQueryClient()

  const { mutate, isPending } = useMutation({
    mutationKey: ['become-streamer'],
    mutationFn: async () => {
      const res = await api.post('/streamer/become')
      return res.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries()

      toast.success(
        'You became a streamer successfully. Try to start streaming now!'
      )
    },
    onError: () => {
      toast.error('Error becoming a streamer. Please try again later.')
    }
  })

  return (
    <div className='flex flex-col gap-4'>
      <p className='text-foreground/50 text-sm'>
        You can become a streamer and earn money by streaming your content. To
        do this, you need to click the button below.
      </p>
      <Button
        variant={'default'}
        disabled={isPending}
        onClick={() => mutate()}
        className='w-fit py-3 text-xl font-bold'
      >
        {isPending ? 'Loading...' : 'Become a streamer'}
      </Button>
    </div>
  )
}

export default BecomeStreamer
