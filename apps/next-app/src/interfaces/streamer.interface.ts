import { IFile } from './file.interface'

export interface IStreamer {
  id: string

  firstName: string
  lastName: string

  username: string
  avatar: IFile

  streamKey: string
  isStreamActive: string
}
