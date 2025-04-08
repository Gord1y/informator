import {
  DeleteObjectCommand,
  PutObjectCommand,
  S3Client
} from '@aws-sdk/client-s3'
import { HttpException, Inject, Injectable } from '@nestjs/common'
import { FileDto } from 'src/dtos/file.dto'

@Injectable()
export class AwsS3Service {
  constructor(@Inject('S3_CLIENT') private readonly s3: S3Client) {}

  async uploadFile(
    bucket: string,
    path: string,
    body: Buffer | string
  ): Promise<FileDto> {
    try {
      const params = {
        Bucket: bucket,
        Key: path,
        Body: body
      }

      const command = new PutObjectCommand(params)
      await this.s3.send(command)

      const fileUrl = `https://${bucket}.s3.${process.env.AWS_REGION}.amazonaws.com/${command.input.Key}`

      return {
        bucket: bucket,
        path: path,
        key: command.input.Key,
        url: fileUrl,
        createdAt: new Date()
      }
    } catch (error) {
      throw new HttpException(error.message, 500)
    }
  }

  async deleteFile(bucket: string, key: string): Promise<boolean> {
    try {
      const params = {
        Bucket: bucket,
        Key: key
      }

      const command = new DeleteObjectCommand(params)
      await this.s3.send(command)

      return true
    } catch (error) {
      throw new HttpException(error.message, 500)
    }
  }
}
