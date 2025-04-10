'use client'

import { useEffect, useRef, useState } from 'react'

const AnimatedNumber: React.FC<{ value: number; duration?: number }> = ({
  value,
  duration = 2000
}) => {
  const [displayValue, setDisplayValue] = useState(0)
  const startTime = useRef<number | null>(null)

  useEffect(() => {
    function animate(timestamp: number) {
      if (startTime.current === null) {
        startTime.current = timestamp
      }
      const progress = Math.min((timestamp - startTime.current) / duration, 1)
      setDisplayValue(Math.floor(progress * value))
      if (progress < 1) {
        requestAnimationFrame(animate)
      }
    }
    requestAnimationFrame(animate)
    return () => {
      startTime.current = null
    }
  }, [value, duration])

  return <span>{displayValue}</span>
}

export default AnimatedNumber
