const InfoBlock: React.FC = () => {
  return (
    <section className='flex w-full flex-col items-center justify-center gap-6 py-8 md:flex-row'>
      <div className='relative h-64 w-64'>
        {/* <Image
          src='/images/sample.jpg'
          alt='Informator Info'
          priority
        /> */}
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
