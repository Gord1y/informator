import Link from 'next/link'

const Problem: React.FC = () => {
  return (
    <h2 className='mt-4 font-semibold'>
      Found a problem? Text{' '}
      <Link href='/contact-us' className='text-primary font-bold'>
        here
      </Link>
    </h2>
  )
}

export default Problem
