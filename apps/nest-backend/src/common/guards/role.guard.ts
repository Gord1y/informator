import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { UserRoleEnum } from 'src/dtos/user.dto'

import { ROLES_KEY } from '../decorators/roles.decorator'

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRole = this.reflector.getAllAndOverride<UserRoleEnum>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()]
    )
    if (!requiredRole) {
      return true
    }
    const { user } = context.switchToHttp().getRequest()

    return UserRoleEnum[requiredRole] <= UserRoleEnum[user.role]
  }
}
