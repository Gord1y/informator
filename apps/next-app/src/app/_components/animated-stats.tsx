'use client'

import { useRef } from 'react'

import useInView from '@/hooks/use-in-ref'

import AnimatedNumber from './animated-number'

const AnimatedStatsBlock: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null)
  const isVisible = useInView(ref, { threshold: 0.5 })

  return (
    <section ref={ref} className='w-full py-8'>
      <div className='mx-auto grid max-w-4xl grid-cols-1 gap-8 text-center md:grid-cols-2'>
        <div className='rounded-lg border p-4 shadow'>
          <h3 className='text-xl font-semibold'>
            {isVisible ? <AnimatedNumber value={75} /> : '0'}%
          </h3>
          <p>User Growth</p>
        </div>
        <div className='rounded-lg border p-4 shadow'>
          <h3 className='text-xl font-semibold'>
            {isVisible ? <AnimatedNumber value={90} /> : '0'}%
          </h3>
          <p>Satisfaction Rate</p>
        </div>
      </div>
    </section>
  )
}

export default AnimatedStatsBlock
