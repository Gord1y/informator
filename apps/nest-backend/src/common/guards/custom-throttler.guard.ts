import { ExecutionContext, Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Reflector } from '@nestjs/core'
import {
  InjectThrottlerOptions,
  InjectThrottlerStorage,
  ThrottlerException,
  ThrottlerGuard,
  ThrottlerModuleOptions,
  ThrottlerStorage
} from '@nestjs/throttler'

import { IpService } from '../../services/ip.service'

@Injectable()
export class CustomThrottlerGuard extends ThrottlerGuard {
  private readonly skippedIps = ['::1', '127.0.0.1', '::ffff:127.0.0.1']

  constructor(
    @InjectThrottlerOptions()
    protected readonly options: ThrottlerModuleOptions,
    @InjectThrottlerStorage()
    protected readonly storageService: ThrottlerStorage,
    protected readonly reflector: Reflector,
    private readonly ipService: IpService,
    private readonly configService: ConfigService
  ) {
    super(options, storageService, reflector)
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest()
    const ip = request.ip || request.connection.remoteAddress

    if (this.skippedIps.includes(ip) || !ip) {
      const isDevelopment =
        this.configService.getOrThrow('APP_ENV') !== 'production'

      if (isDevelopment) {
        return true
      } else {
        return false
      }
    }

    const dbIP = await this.ipService.getOrCreate(ip)

    request.ipAddress = dbIP

    if (dbIP.isBlocked) {
      if (dbIP.isBlockedUntil) {
        if (dbIP.isBlockedUntil.getTime() > Date.now()) {
          throw new ThrottlerException(
            'Too many requests. You have been blocked for 1 hour.'
          )
        } else {
          await this.ipService.update(dbIP.id, {
            isBlocked: false,
            isBlockedUntil: null
          })
        }
      } else {
        return false
      }
    }

    try {
      const result = await super.canActivate(context)
      return result
    } catch (err) {
      if (err instanceof ThrottlerException) {
        if (dbIP.isBlocked) {
          throw new ThrottlerException(
            'Too many requests. You have been blocked for 1 hour.'
          )
        } else {
          await this.ipService.update(dbIP.id, {
            isBlocked: true,
            isBlockedUntil: new Date(Date.now() + 3600000)
          })
          throw new ThrottlerException(
            'Too many requests. You have been blocked for 1 hour.'
          )
        }
      }
      throw err
    }
  }
}
