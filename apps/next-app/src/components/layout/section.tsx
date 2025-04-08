import { PropsWithChildren } from 'react'

import { cn } from '@/lib/utils'

interface Props {
  as?: React.ElementType
  id?: string
  className?: string
  disableMaxWidth?: boolean
}

const Section: React.FC<PropsWithChildren<Props>> = ({
  as: Component = 'section',
  disableMaxWidth = false,
  className,
  id,
  children
}) => {
  return (
    <Component
      id={id}
      className={cn(
        'mx-auto w-full p-0',
        {
          'w-11/12 max-w-screen-sm md:max-w-screen-md lg:max-w-screen-lg xl:max-w-screen-xl 2xl:max-w-screen-2xl':
            !disableMaxWidth
        },
        className
      )}
    >
      {children}
    </Component>
  )
}

export default Section
