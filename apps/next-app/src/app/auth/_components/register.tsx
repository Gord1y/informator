import { useMutation } from '@tanstack/react-query'
import { SubmitHandler, useForm } from 'react-hook-form'

import { Button } from '@/components/ui/button'
import Field from '@/components/ui/field'

import { IUserRegister } from '@/interfaces/user/register.interface'
import { authService } from '@/services/auth.service'

interface Props {
  setStep: React.Dispatch<React.SetStateAction<0 | 1>>
  setEmail: React.Dispatch<React.SetStateAction<string>>
}

const Register: React.FC<Props> = ({ setStep, setEmail }) => {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors }
  } = useForm<IUserRegister>({
    mode: 'onChange',
    defaultValues: {
      email: '',
      firstName: '',
      lastName: ''
    }
  })

  const { mutate, isPending } = useMutation({
    mutationKey: ['login'],
    mutationFn: async (data: IUserRegister) => authService.register(data),
    onSuccess: (_, data) => {
      setStep(1)
      setEmail(data.email)
    },
    onError: () => {
      setError('email', {
        type: 'manual',
        message: 'Cannot register with this email'
      })
    }
  })

  const onSubmit: SubmitHandler<IUserRegister> = async data => {
    mutate(data)
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className='flex w-full flex-col gap-1 md:gap-2'
    >
      <Field
        title={'Email'}
        type={'email'}
        placeholder={'email@informator.com'}
        autoComplete='email'
        className='mt-0'
        {...register('email', {
          required: 'Email is required',
          pattern: {
            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
            message: 'Invalid email address'
          }
        })}
        error={errors?.email?.message}
      />
      <Field
        title={'Your name'}
        type={'text'}
        placeholder={'Daniel'}
        autoComplete='given-name'
        className='mt-0'
        {...register('firstName', {
          required: 'First name is required'
        })}
        error={errors?.firstName?.message}
      />
      <Field
        title={'Last name'}
        type={'text'}
        placeholder={'Smith'}
        autoComplete='family-name'
        className='mt-0'
        {...register('lastName', {
          required: 'Last name is required'
        })}
        error={errors?.lastName?.message}
      />

      <Button
        variant={'default'}
        size={'lg'}
        className='mt-2 w-full'
        disabled={isPending}
      >
        {isPending ? 'Loading...' : 'Next step'}
      </Button>
    </form>
  )
}

export default Register
