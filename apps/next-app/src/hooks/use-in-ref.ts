import { useEffect, useState } from 'react'

export default function useInView(
  ref: React.RefObject<Element | null>,
  options = {}
) {
  const [isIntersecting, setIntersecting] = useState(false)

  useEffect(() => {
    if (!ref || !ref.current) return
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIntersecting(true)
        // Unobserve after triggering to run the animation only once.
        observer.unobserve(ref.current!)
      }
    }, options)
    observer.observe(ref.current)
    return () => {
      observer.disconnect()
    }
  }, [ref, options])

  return isIntersecting
}
