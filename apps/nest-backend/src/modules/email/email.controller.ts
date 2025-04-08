import { Controller } from '@nestjs/common'
import { OnEvent } from '@nestjs/event-emitter'
import { ApiTags } from '@nestjs/swagger'
import { EventPayloads } from 'src/common/event-emmiter/event-types.interface'

import { EmailService } from './email.service'

@ApiTags('Email')
@Controller('email')
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @OnEvent('user.welcome')
  async welcomeEmail(data: EventPayloads['user.welcome']) {
    await this.emailService.sendTemplateEmail(
      data.email,
      `Welcome to our service!`,
      'user.welcome',
      data
    )
  }

  @OnEvent('auth.register')
  async registerEmail(data: EventPayloads['auth.register']) {
    await this.emailService.sendTemplateEmail(
      data.email,
      `Registration Confirmation`,
      'auth.register',
      data
    )
  }

  @OnEvent('auth.login')
  async loginEmail(data: EventPayloads['auth.login']) {
    await this.emailService.sendTemplateEmail(
      data.email,
      `Login Notification`,
      'auth.login',
      data
    )
  }
}
