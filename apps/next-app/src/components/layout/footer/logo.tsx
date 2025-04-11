import Link from 'next/link'

const Logo: React.FC = () => {
  return (
    <Link href='/'>
      <h1 className='mt-5 text-2xl font-bold text-primary lg:mt-0 lg:text-4xl'>
        Informator
      </h1>
    </Link>
  )
}

export default Logo
