import Link from 'next/link'

const CreatedBy = () => {
  return (
    <h3 className='w-fit'>
      Created by{' '}
      <Link href='https://gord1y.dev/' className='text-primary' target='_blank'>
        Gord1y
      </Link>
    </h3>
  )
}

export default CreatedBy
