'use client'

import Image from 'next/image'
import Link from 'next/link'

import { IStreamer } from '@/interfaces/streamer.interface'

interface Props {
  streamers: IStreamer[]
}

const StreamersBlock: React.FC<Props> = ({ streamers }) => {
  return (
    <section className='w-full py-8'>
      <div className='mx-auto max-w-7xl'>
        <h2 className='mb-8 text-center text-3xl font-bold'>Top Streamers</h2>
        <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-4'>
          {streamers.map((streamer, index) => (
            <StreamerCard key={index} {...streamer} />
          ))}
        </div>
      </div>
    </section>
  )
}

export default StreamersBlock

const StreamerCard: React.FC<IStreamer> = ({
  avatar,
  firstName,
  lastName,
  username,
  isStreamActive,
  streamKey
}) => {
  return (
    <Link
      href={`/streamer/${username}`}
      className='relative rounded-lg border p-4 shadow transition-transform duration-200 hover:scale-105'
    >
      {isStreamActive && (
        <div className='absolute top-0 right-0 z-10 m-2 rounded-full bg-green-500 p-1 text-white'>
          Live
        </div>
      )}
      <div className='relative h-40 w-full'>
        <Image
          src={avatar.url}
          alt={streamKey}
          layout='fill'
          objectFit='cover'
        />
      </div>
      <h3 className='mt-2 text-center text-lg font-medium'>{username}</h3>
    </Link>
  )
}
