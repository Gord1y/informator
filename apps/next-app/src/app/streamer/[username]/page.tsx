import StreamerComponent from './_components'
import { IStreamer } from '@/interfaces/streamer.interface'

const getStreamerInfo = async (username: string) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/streamer/${username}`,
      {
        next: { revalidate: 10 }
      }
    )

    if (!response.ok) {
      throw new Error('Failed to fetch streamer info')
    }

    const data = (await response.json()) as IStreamer
    return data
  } catch (error) {
    console.error('Error fetching streamer info:', error)
    return null
  }
}

export default async function Page({
  params
}: {
  params: Promise<{ username: string }>
}) {
  const { username } = await params

  const streamerInfo = await getStreamerInfo(username)

  return <StreamerComponent streamer={streamerInfo} username={username} />
}
