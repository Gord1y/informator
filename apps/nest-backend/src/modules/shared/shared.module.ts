import { Global, Module } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { IpService } from 'src/services/ip.service'
import { QueryService } from 'src/services/query.service'

import { LogsService } from '../logs/logs.service'
import { UserService } from '../user/user.service'

@Global()
@Module({
  providers: [IpService, LogsService, QueryService, JwtService, UserService],
  exports: [IpService, LogsService, QueryService, JwtService, UserService]
})
export class SharedModule {}
