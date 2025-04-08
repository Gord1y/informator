import { InputHTMLAttributes } from 'react'
import { Control, FieldErrors } from 'react-hook-form'

export interface IProneField extends InputHTMLAttributes<HTMLInputElement> {
  errors?: FieldErrors<{
    phone: string
  }>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: Control<any>
  inputClassName?: string
  required?: boolean
}
