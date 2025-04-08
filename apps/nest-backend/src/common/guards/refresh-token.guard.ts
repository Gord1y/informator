import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import { Request } from 'express'
import { UserService } from 'src/modules/user/user.service'

import { cookies } from '../constants/cookies'

@Injectable()
export class RefreshTokenGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly userService: UserService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>()

    if (!request.headers.cookie) {
      throw new UnauthorizedException('No tokens provided')
    }

    const token = request.headers.cookie
      .split('; ')
      .find(c => c.startsWith(`${cookies.refreshToken}=`))
      ?.split('=')[1]

    if (!token) {
      throw new UnauthorizedException('No refresh token provided')
    }

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.configService.get('JWT_REFRESH_TOKEN_SECRET'),
        algorithms: ['HS256']
      })
      const user = await this.userService.findById(payload.id)
      if (!user) {
        throw new UnauthorizedException('User not found')
      }
      request['user'] = user
    } catch {
      throw new UnauthorizedException('Invalid or expired refresh token')
    }
    return true
  }
}
