import { Module } from '@nestjs/common'

import { EnvironmentConfigController } from './environment-config.controller'
import { EnvironmentConfigService } from './environment-config.service'
import { ConfigInitializationService } from './initialize-config.service'

@Module({
  controllers: [EnvironmentConfigController],
  providers: [ConfigInitializationService, EnvironmentConfigService]
})
export class EnvironmentConfigModule {}
