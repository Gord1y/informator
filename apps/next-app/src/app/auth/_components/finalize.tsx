import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'

import { Button } from '@/components/ui/button'
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot
} from '@/components/ui/input-otp'

import { useAuth } from '@/contexts/auth-context'
import { IUserFinalize } from '@/interfaces/user/finalize.interface'
import { authService } from '@/services/auth.service'

interface Props {
  email: string
  setStep: React.Dispatch<React.SetStateAction<0 | 1>>
  type: 'login' | 'register'
}

const Finalize: React.FC<Props> = ({ email, setStep, type }) => {
  const { login } = useAuth()
  const { refresh } = useRouter()
  const {
    control,
    handleSubmit,
    setError,
    formState: { errors }
  } = useForm<IUserFinalize>({
    mode: 'onChange',
    defaultValues: {
      email: email,
      otp: ''
    }
  })

  const { mutate, isPending } = useMutation({
    mutationKey: ['finalize', type],
    mutationFn: async (data: IUserFinalize) =>
      type === 'login'
        ? authService.finalizeLogin(data, login)
        : authService.finalizeRegister(data, login),
    onSuccess: () => {
      refresh()
    },
    onError: () => {
      setError('otp', {
        type: 'manual',
        message: 'Cannot finalize with this OTP'
      })
    }
  })

  const onSubmit: SubmitHandler<IUserFinalize> = async data => {
    mutate(data)
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className='flex w-full flex-col items-center gap-1 md:gap-2'
    >
      <Controller
        name='otp'
        control={control}
        rules={{
          required: "OTP Required",
        }}
        render={({ field }) => (
          <div className='mg:my-4 my-2 flex flex-col gap-1'>
            <InputOTP
              maxLength={6}
              value={field.value}
              onChange={field.onChange}
            >
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
              </InputOTPGroup>
              <InputOTPSeparator />
              <InputOTPGroup>
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
            {errors.otp?.message && (
              <div className='mt-1 font-medium text-red-500'>
                *{errors.otp?.message}
              </div>
            )}
          </div>
        )}
      />
      <Button
        variant={'default'}
        size={'lg'}
        className='w-full'
        disabled={isPending}
      >
        {isPending ? 'Loading...' : 'Submit'}
      </Button>
      <Button
        variant={'outline'}
        size={'lg'}
        className='w-full'
        onClick={() => setStep(0)}
      >
        Back
      </Button>
    </form>
  )
}

export default Finalize
