import { Module } from '@nestjs/common'

import { LogsService } from './logs.service'

@Module({
  controllers: [],
  providers: [LogsService]
})
export class LogsModule {}
