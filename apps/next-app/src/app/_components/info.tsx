import Image from 'next/image'

const InfoBlock: React.FC = () => {
  return (
    <section className='flex w-full flex-col items-center justify-center gap-6 py-8 md:flex-row'>
      <div className='relative w-64'>
        <Image
          src={
            'https://marketplace.canva.com/EAFmRpxWdA4/2/0/1600w/canva-minimalist-girl-gamer-streaming-twitch-banner-KC7bSAdJiHE.jpg'
          }
          width={1920}
          height={1080}
          alt='Informator Info'
          priority
          className='w-full'
        />
      </div>
      <div className='max-w-md text-center md:text-left'>
        <h2 className='text-3xl font-bold'>Discover Amazing Content</h2>
        <p className='mt-4 text-lg'>
          Explore live streams, exclusive shows, and community events – all in
          one platform.
        </p>
      </div>
    </section>
  )
}

export default InfoBlock
