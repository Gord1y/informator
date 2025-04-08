import { PropsWithChildren } from 'react'

import { cn } from '@/lib/utils'

interface Props {
  as?: React.ElementType
  id?: string
  className?: string
}

const Heading: React.FC<PropsWithChildren<Props>> = ({
  as: Component = 'h2',
  className,
  id,
  children
}) => {
  return (
    <Component
      id={id}
      className={cn(
        'text-xl font-bold md:text-2xl lg:font-extrabold',
        className
      )}
    >
      {children}
    </Component>
  )
}

export default Heading
