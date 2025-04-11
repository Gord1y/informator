import { IFile } from '../file.interface'

export enum Gender {
  male = 'male',
  female = 'female',
  other = 'other'
}

export interface IUser {
  id: string
  googleId?: string

  email?: string
  username?: string

  firstName?: string
  lastName?: string
  gender?: Gender

  streamKey: string
  isStreamActive: boolean

  avatar?: IFile

  createdAt: Date
  updatedAt: Date
}

export interface IUserUpdate {
  email?: string
  username?: string
  firstName?: string
  lastName?: string
  gender?: Gender
}

export interface ICurrentUser {
  user: IUser | null
  authorized: boolean
}
