'use client'

import { useQuery } from '@tanstack/react-query'
import { Loader } from 'lucide-react'
import { useEffect } from 'react'
import { toast } from 'sonner'

import Heading from '@/components/layout/heading'
import Section from '@/components/layout/section'

import BecomeStreamer from './become-streamer'
import UpdateData from './update'
import { useAuth } from '@/contexts/auth-context'
import { IUser } from '@/interfaces/user/user.interface'
import api from '@/services/api'

const DashboardComponent: React.FC = () => {
  const { updateUser } = useAuth()
  const { data, isLoading, isError } = useQuery({
    queryKey: ['user'],
    queryFn: async () => await api.get<IUser>('/user'),

    retry: 0,
    select: res => res.data
  })

  useEffect(() => {
    if (data) {
      updateUser(data)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data])

  return (
    <Section disableMaxWidth className='flex flex-col gap-2 md:gap-4'>
      <Heading>Dashboard</Heading>
      {isLoading ? (
        <Loader className='size-10 animate-spin' />
      ) : isError || !data ? (
        <span className='text-red-500'>
          Error loading data. Please try again or contact support.
        </span>
      ) : (
        <>
          <p className='text-foreground/50 text-sm'>
            You can edit your information here
            {data.streamKey ? ' or view your profile and stats' : '.'}
          </p>
          <section className='bg-primary/20 flex flex-col gap-2 rounded-lg p-4'>
            {data.streamKey ? (
              <p className='text-foreground/50 text-sm'>
                You are a streamer. Your stream key is:{' '}
                <button
                  className='text-primary cursor-pointer text-lg font-bold hover:underline'
                  onClick={() => {
                    navigator.clipboard.writeText(data.streamKey)
                    toast('Stream key copied to clipboard')
                  }}
                >
                  {data.streamKey}
                </button>
                <br />
                {data.isStreamActive
                  ? 'You are streaming now.'
                  : 'You can start streaming now.'}
              </p>
            ) : !data.username ? (
              <p className='text-foreground/50 text-sm'>
                You are not a streamer. To become a streamer, you need to create
                a username first.
              </p>
            ) : (
              <BecomeStreamer />
            )}
          </section>

          <UpdateData user={data} />
        </>
      )}
    </Section>
  )
}

export default DashboardComponent
