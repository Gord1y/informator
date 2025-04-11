import Link from 'next/link'

const CTASection: React.FC = () => {
  return (
    <section className='bg-primary flex w-full flex-col items-center justify-center py-12 text-center text-white'>
      <h2 className='text-3xl font-bold'>Join Informator Today</h2>
      <p className='mt-4 text-lg'>
        Experience streaming like never before. Sign up now!
      </p>
      <Link
        href='/auth'
        className='text-primary hover:text-primary mt-6 block w-40 rounded-full bg-white px-6 py-3 font-semibold transition hover:bg-white/80'
      >
        Get Started
      </Link>
    </section>
  )
}

export default CTASection
