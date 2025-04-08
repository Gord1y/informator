import cn from 'clsx'
import { forwardRef } from 'react'
import { Controller } from 'react-hook-form'
import PhoneInput, { isValidPhoneNumber } from 'react-phone-number-input'
import 'react-phone-number-input/style.css'

import { IProneField } from './phone-field.interface'

const PhoneField = forwardRef<HTMLInputElement, IProneField>(
  ({ control, errors, className, inputClassName, required, ...rest }, ref) => {
    return (
      <div className={cn('mt-2 w-full', className)} ref={ref}>
        <label>
          <span className='text-lg font-semibold'>Номер телефону</span>
          <Controller
            name='phone'
            control={control}
            rules={{
              required: required ? 'Це поле є обов’язковим' : false,
              validate: value => {
                if (!value && !required) return true
                return (
                  isValidPhoneNumber(value) || 'Невірний формат номеру телефону'
                )
              }
            }}
            render={({ field }) => (
              <div
                className={cn(
                  'mt-1 w-full rounded border-2 bg-input px-4 py-2 font-medium text-card-foreground outline-none transition-all placeholder:text-card-foreground/50',
                  {
                    '!border-red-500': errors?.phone
                  },
                  inputClassName
                )}
              >
                <PhoneInput
                  {...rest}
                  onChange={field.onChange}
                  value={field.value}
                  international
                  locales={'uk'}
                  autoComplete='tel'
                />
              </div>
            )}
          />
        </label>
        {errors?.phone && (
          <span className='mt-1 font-medium text-red-500'>
            {errors.phone.message}
          </span>
        )}
      </div>
    )
  }
)

PhoneField.displayName = 'PhoneField'

export default PhoneField
