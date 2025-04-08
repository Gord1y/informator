import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { TypedEventEmitter } from 'src/common/event-emmiter/typed-event-emitter.service'
import { QueryService } from 'src/services/query.service'

import { UserService } from '../user/user.service'

import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { OtpCleanupService } from './otp-cleanup.service'
import { OtpService } from './otp.service'

@Module({
  imports: [JwtModule],
  controllers: [AuthController],
  providers: [
    AuthService,
    UserService,
    QueryService,
    TypedEventEmitter,
    OtpService,
    OtpCleanupService
  ],
  exports: [AuthService, OtpService, OtpCleanupService]
})
export class AuthModule {}
