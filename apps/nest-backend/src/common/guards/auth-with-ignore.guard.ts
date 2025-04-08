import {
  CanActivate,
  ExecutionContext,
  HttpException,
  Injectable
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Reflector } from '@nestjs/core'
import { JwtService } from '@nestjs/jwt'
import { Request } from 'express'
import { cookies } from 'src/common/constants/cookies'
import { UserService } from 'src/modules/user/user.service'

import { IS_PUBLIC_KEY } from '../decorators/is-public.decorator'

@Injectable()
export class AuthGuardWithIgnore implements CanActivate {
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
          ignoreExpiration: true,
          secret: this.configService.get('JWT_ACCESS_TOKEN_SECRET'),
          algorithms: ['HS256']
        })
        const user = await this.userService.findById(payload.id)
        if (user) {
          request['user'] = user
        } else if (!isPublic) {
          throw new HttpException('user_not_found', 401)
        }
      } catch {
        throw new HttpException('invalid_or_expired_token', 401)
      }
    } else if (!isPublic) {
      throw new HttpException('no_access_token', 401)
    }

    return true
  }
}
