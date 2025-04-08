import { IFile } from '../file.interface'

export enum Gender {
  male = 'male',
  female = 'female',
  other = 'other'
}

export interface IUser {
  id: string
  email?: string
  googleId?: string

  firstName?: string
  lastName?: string
  middleName?: string

  streamKey: string
  isStreamActive: boolean

  avatar?: IFile

  createdAt: Date
  updatedAt: Date
}

export interface IUserUpdate {
  email?: string
  firstName?: string
  lastName?: string
  middleName?: string
  phone?: string
  gender?: Gender
}

export interface ICurrentUser {
  user: IUser | null
  authorized: boolean
}
