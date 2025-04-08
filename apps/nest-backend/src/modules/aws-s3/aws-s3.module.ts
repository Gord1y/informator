import { S3Client } from '@aws-sdk/client-s3'
import { Global, Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'

import { AwsS3Service } from './aws-s3.service'

@Global()
@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: 'S3_CLIENT',
      useFactory: (configService: ConfigService) => {
        return new S3Client({
          region: configService.get<string>('AWS_REGION'),
          credentials: {
            accessKeyId: configService.get<string>('AWS_ACCESS_KEY_ID'),
            secretAccessKey: configService.get<string>('AWS_SECRET_ACCESS_KEY')
          }
        })
      },
      inject: [ConfigService]
    },
    AwsS3Service
  ],
  exports: ['S3_CLIENT', AwsS3Service]
})
export class AwsS3Module {}
