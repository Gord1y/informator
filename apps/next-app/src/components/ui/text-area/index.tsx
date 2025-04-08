import cn from 'clsx'
import { forwardRef } from 'react'

import { ITextArea } from './text-area.interface'

const TextArea = forwardRef<HTMLTextAreaElement, ITextArea>(
  (
    {
      title,
      placeholder,
      error,
      className,
      inputClassName,
      rows,
      cols,
      ...rest
    },
    ref
  ) => (
    <div className={cn('mt-2 w-full', className)}>
      <label>
        <span className='text-lg font-semibold'>{title}</span>
        <textarea
          placeholder={placeholder}
          ref={ref}
          rows={rows || 5}
          cols={cols || 5}
          className={cn(
            'mt-1 w-full rounded-md border-2 bg-input px-4 py-2 font-medium text-foreground outline-none transition-all placeholder:text-foreground/80',
            {
              '!border-red-500': !!error
            },
            inputClassName
          )}
          {...rest}
        />
      </label>
      {error && <div className='mt-1 font-medium text-red-500'>*{error}</div>}
    </div>
  )
)

TextArea.displayName = 'TextArea'

export default TextArea
