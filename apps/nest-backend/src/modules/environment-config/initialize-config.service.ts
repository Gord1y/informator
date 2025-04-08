import { Injectable, OnModuleInit } from '@nestjs/common'

import { defaultConfigs } from './defaults'
import { EnvironmentConfigService } from './environment-config.service'

@Injectable()
export class ConfigInitializationService implements OnModuleInit {
  constructor(private envConfigService: EnvironmentConfigService) {}

  async onModuleInit() {
    await this.initializeConfigs()
  }

  private async initializeConfigs() {
    for (const dto of defaultConfigs) {
      const existingConfig = await this.envConfigService.findByKey(dto.key)
      if (!existingConfig) {
        await this.envConfigService.create(dto)
        console.log(`Config ${dto.key} initialized with default value.`)
      }
    }
  }
}
