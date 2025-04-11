import { IFile } from '@/interfaces/file.interface'

export const GetImageUrl = (image: IFile) => {
  if (image.key && image.bucket) {
    return `${process.env.NEXT_PUBLIC_API_URL}/files?bucket=${image.bucket}&key=${image.key}`
  }

  if (image.url) {
    return image.url
  }

  return ''
}
