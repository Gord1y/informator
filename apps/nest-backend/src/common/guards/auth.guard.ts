import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Reflector } from '@nestjs/core'
import { JwtService } from '@nestjs/jwt'
import { Request } from 'express'
import { UserService } from 'src/modules/user/user.service'

import { cookies } from '../constants/cookies'
import { IS_PUBLIC_KEY } from '../decorators/is-public.decorator'

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private reflector: Reflector,
    private readonly configService: ConfigService,
    private readonly userService: UserService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass()
    ])

    const request = context.switchToHttp().getRequest<Request>()
    const token = request.headers.cookie
      ?.split('; ')
      .find(c => c.startsWith(`${cookies.accessToken}=`))
      ?.split('=')[1]

    if (token) {
      try {
        const payload = await this.jwtService.verifyAsync(token, {
          secret: this.configService.get('JWT_ACCESS_TOKEN_SECRET'),
          algorithms: ['HS256']
        })
        const user = await this.userService.findById(payload.id)
        if (user) {
          request['user'] = user
        } else if (!isPublic) {
          throw new UnauthorizedException('User not found')
        }
      } catch {
        throw new UnauthorizedException('Invalid or expired access token')
      }
    } else if (!isPublic) {
      throw new UnauthorizedException('No access token provided')
    }

    return true
  }
}
