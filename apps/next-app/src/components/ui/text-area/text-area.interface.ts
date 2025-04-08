import { TextareaHTMLAttributes } from 'react'

export interface ITextArea extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  title: string
  placeholder?: string
  error?: string
  inputClassName?: string
  cols?: number
  rows?: number
}
