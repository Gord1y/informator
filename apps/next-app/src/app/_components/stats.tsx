'use client'

import { useRef } from 'react'

import useInView from '@/hooks/use-in-ref'

import AnimatedNumber from './animated-number'

const StatsBlock: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null)
  const isVisible = useInView(ref, { threshold: 0.5 })

  return (
    <section ref={ref} className='w-full py-8'>
      <div className='mx-auto grid max-w-5xl grid-cols-1 gap-4 text-center md:grid-cols-3'>
        <div className='p-4'>
          <h2 className='text-2xl font-semibold'>
            {isVisible ? <AnimatedNumber value={5000} /> : '0'}
          </h2>
          <p>Live Streams</p>
        </div>
        <div className='p-4'>
          <h2 className='text-2xl font-semibold'>
            {isVisible ? <AnimatedNumber value={120000} /> : '0'}
          </h2>
          <p>Viewers</p>
        </div>
        <div className='p-4'>
          <h2 className='text-2xl font-semibold'>
            {isVisible ? <AnimatedNumber value={300} /> : '0'}
          </h2>
          <p>Streamers</p>
        </div>
      </div>
    </section>
  )
}

export default StatsBlock
