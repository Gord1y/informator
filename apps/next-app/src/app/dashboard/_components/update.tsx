'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { memo } from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import Field from '@/components/ui/field'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'

import { Gender, IUser, IUserUpdate } from '@/interfaces/user/user.interface'
import api from '@/services/api'

interface Props {
  user: IUser
}

const UpdateData: React.FC<Props> = memo(({ user }) => {
  const queryClient = useQueryClient()

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<IUserUpdate>({
    mode: 'onChange',
    defaultValues: {
      email: user.email,
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      gender: user.gender
    }
  })

  const { mutate, isPending } = useMutation({
    mutationKey: ['update-user-data'],
    mutationFn: async (data: IUserUpdate) => {
      const res = await api.patch<IUser>('/user', data)
      return res.data
    },
    onSuccess: async data => {
      await queryClient.refetchQueries()
      toast('Your data has been updated successfully')
      reset({
        email: data.email,
        username: data.username,
        firstName: data.firstName,
        lastName: data.lastName,
        gender: data.gender
      })
    },
    onError: () => {
      toast.error('Error updating data. Please try again or contact support.')
    }
  })

  const onSubmit: SubmitHandler<IUserUpdate> = async data => mutate(data)

  return (
    <>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className='grid grid-cols-1 gap-2 md:grid-cols-2 md:gap-3 lg:gap-4'
      >
        <Field
          title={'Email'}
          placeholder={'Email'}
          type={'email'}
          {...register('email', {
            required: 'Email should not be empty',
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
              message: 'Email is not valid'
            }
          })}
          error={errors.email?.message}
        />
        <Field
          title={'Username'}
          placeholder={'Username'}
          type={'text'}
          {...register('username', {
            required: 'Username should not be empty',
            pattern: {
              message: 'Username is not valid',
              value: /^[a-zA-Z0-9_]+$/i
            }
          })}
          error={errors.username?.message}
        />

        <Field
          title={'First Name'}
          placeholder={'Mykhail'}
          type={'text'}
          {...register('firstName', {
            required: 'First Name should not be empty',
            maxLength: {
              value: 50,
              message: `First Name cannot be more than 50 characters`
            },
            minLength: {
              value: 2,
              message: `First Name cannot be less than 2 characters`
            }
          })}
          error={errors.firstName?.message}
        />
        <Field
          title={'Last Name'}
          placeholder={'Servenko'}
          type={'text'}
          {...register('lastName', {
            required: 'Last Name should not be empty',
            maxLength: {
              value: 50,
              message: 'Last Name cannot be more than 50 characters'
            },
            minLength: {
              value: 2,
              message: 'Last Name cannot be less than 2 characters'
            }
          })}
          error={errors.lastName?.message}
        />

        <Controller
          control={control}
          name='gender'
          render={({ field: { onChange, value } }) => (
            <label>
              <span className='text-lg font-semibold'>Gender</span>
              <Select
                required={false}
                value={value}
                defaultValue={value || ''}
                onValueChange={value => {
                  if (value) {
                    onChange(value)
                  } else {
                    onChange(undefined)
                  }
                }}
              >
                <SelectTrigger className='border-border bg-input mt-1 w-full justify-start rounded-md border-2 px-4 py-5 text-left text-base font-medium'>
                  <SelectValue
                    placeholder='Select your gender'
                    className='text-foreground w-full'
                  >
                    Select your gender
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value={Gender.male}>Male</SelectItem>
                    <SelectItem value={Gender.female}>Female</SelectItem>
                    <SelectItem value={Gender.other}>Other</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
              {errors.gender?.message && (
                <div className='mt-1 font-medium text-red-500'>
                  *{errors.gender?.message}
                </div>
              )}
            </label>
          )}
        />

        <Button
          type='submit'
          variant={'destructive'}
          disabled={isPending}
          className='w-full self-end'
          size={'lg'}
        >
          {isPending ? 'Loading...' : 'Update details'}
        </Button>
      </form>
    </>
  )
})

UpdateData.displayName = 'UpdateUserData'

export default UpdateData
