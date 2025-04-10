'use client'

import StreamPlayer from './stream'
import { IStreamer } from '@/interfaces/streamer.interface'

interface Props {
  streamer: IStreamer | null
}
const StreamerComponent: React.FC<Props> = ({ streamer }) => {
  console.log(streamer)
  if (!streamer) return <div>Streamer not found</div>

  if (streamer.isStreamActive) {
    return (
      <div className='flex h-screen flex-col items-center justify-center'>
        <h1 className='text-2xl font-bold'>Streamer is live!</h1>
        {/* <img
          src={streamer.avatar.url}
          alt='Streamer Thumbnail'
          className='h-auto w-full'
        />
        {streamer.streamKey} */}
        <StreamPlayer streamKey={streamer.streamKey} />
      </div>
    )
  }

  return (
    <div className='flex h-screen flex-col items-center justify-center'>
      <h1 className='text-2xl font-bold'>Streamer is offline</h1>
      <img
        src={streamer.avatar.url}
        alt='Streamer Thumbnail'
        className='h-auto w-full'
      />
    </div>
  )
}

export default StreamerComponent
