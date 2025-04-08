import { MailerModule } from '@nestjs-modules/mailer'
import { Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { QueryService } from 'src/services/query.service'

import { UserService } from '../user/user.service'

import { EmailController } from './email.controller'
import { EmailService } from './email.service'

@Module({
  imports: [
    MailerModule.forRootAsync({
      useFactory: async (config: ConfigService) => ({
        transport: {
          host: config.get('ZOHO_HOST'),
          port: Number(config.get('ZOHO_PORT')),
          secure: true,
          auth: {
            user: config.get('ZOHO_EMAIL'),
            pass: config.get('ZOHO_PASSWORD')
          }
        },
        defaults: {
          from: `Graverse <${config.get('ZOHO_EMAIL')}>`
        }
      }),
      inject: [ConfigService]
    })
  ],
  controllers: [EmailController],
  providers: [EmailService, UserService, QueryService]
})
export class EmailModule {}
