import { Controller, Get } from '@nestjs/common'
import { ApiOperation, ApiTags } from '@nestjs/swagger'

import { AppService } from './app.service'

@Controller()
@ApiTags('App Сontroller')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOperation({ summary: 'Get API status' })
  async getStatus() {
    return {
      status: 'ok',
      message: 'API is running',
      version: '1.0.0',
      time: new Date().toISOString()
    }
  }
}
