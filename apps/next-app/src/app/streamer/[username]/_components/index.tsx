'use client'

import Image from 'next/image'

import Heading from '@/components/layout/heading'
import Section from '@/components/layout/section'

import StreamPlayer from './stream'
import { IStreamer } from '@/interfaces/streamer.interface'
import { cn } from '@/lib/utils'

interface Props {
  streamer: IStreamer | null
  username: string
}
const StreamerComponent: React.FC<Props> = ({ streamer, username }) => {
  return (
    <Section disableMaxWidth className='flex flex-col gap-2 md:gap-4'>
      <Heading>Streamer {username}</Heading>
      {streamer ? (
        <section className='flex w-full flex-col gap-4'>
          <div className='flex flex-col gap-2 md:gap-4'>
            <div className='flex flex-col gap-1 md:gap-2'>
              <p className='text-sm text-gray-500'>
                Name: {streamer.firstName}
              </p>
              <p className='text-sm text-gray-500'>Followers: {1000}</p>
              <p className='text-sm text-gray-500'>
                Description: {'Lorem ipsum text'}
              </p>
            </div>

            {streamer.isStreamActive ? (
              <p className='text-sm text-green-500'>Status: Online</p>
            ) : (
              <p className='text-sm text-red-500'>Status: Offline</p>
            )}
          </div>
          {streamer.isStreamActive ? (
            <StreamPlayer streamKey={streamer.streamKey} />
          ) : (
            streamer.avatar.url && (
              <Image
                src={streamer.avatar.url}
                alt='Streamer avatar'
                className='h-fit w-full max-w-lg rounded-lg'
                width={500}
                height={500}
              />
            )
          )}
        </section>
      ) : (
        <div>Streamer not found</div>
      )}
    </Section>
  )
}

export default StreamerComponent
