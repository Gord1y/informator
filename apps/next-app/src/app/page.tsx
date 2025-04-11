import AnimatedStatsBlock from './_components/animated-stats'
import BannerBlock from './_components/banner'
import CTASection from './_components/cta'
import InfoBlock from './_components/info'
import StatsBlock from './_components/stats'
import StreamersBlock from './_components/streamers'
import { IResultWithPagination } from '@/interfaces/pagination.interface'
import { IStreamer } from '@/interfaces/streamer.interface'

const loadStreamers = async () => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/streamer`,
      {
        next: { revalidate: 15 }
      }
    )
    if (!response.ok) {
      throw new Error('Network response was not ok')
    }
    const data = (await response.json()) as IResultWithPagination<IStreamer>

    return data.result
  } catch (error) {
    //eslint-disable-next-line no-console
    console.error('Failed to fetch streamers:', error)
    return []
  }
}

export default async function Home() {
  const streamers = await loadStreamers()

  return (
    <>
      <BannerBlock />
      <StatsBlock />
      <InfoBlock />
      <AnimatedStatsBlock />
      <StreamersBlock streamers={streamers} />
      <CTASection />
    </>
  )
}
