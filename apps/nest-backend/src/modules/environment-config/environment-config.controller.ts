import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UseGuards
} from '@nestjs/common'
import {
  ApiCookieAuth,
  ApiOperation,
  ApiResponse,
  ApiTags
} from '@nestjs/swagger'
import { EnvironmentConfig, UserRole } from '@prisma/client'
import { cookies } from 'src/common/constants/cookies'
import { Public } from 'src/common/decorators/is-public.decorator'
import { Roles } from 'src/common/decorators/roles.decorator'
import { AuthGuard } from 'src/common/guards/auth.guard'
import { RoleGuard } from 'src/common/guards/role.guard'
import { QueryDto } from 'src/dtos/pagination/query.dto'
import { ResultWithPagination } from 'src/dtos/pagination/result-with-pagination.dto'

import { CreateConfigDto } from './dto/create-config.dto'
import { EnvironmentConfigService } from './environment-config.service'

@Controller('environment-config')
@ApiTags('Environment Config Controller')
export class EnvironmentConfigController {
  constructor(
    private readonly environmentConfigService: EnvironmentConfigService
  ) {}

  @Get('admin')
  @HttpCode(200)
  @Public(false)
  @Roles(UserRole.admin)
  @UseGuards(AuthGuard, RoleGuard)
  @ApiCookieAuth(cookies.accessToken)
  @ApiOperation({
    summary: 'Admin: Get environment configs by query'
  })
  @ApiResponse({
    status: 200,
    description: 'Return configs by query',
    type: ResultWithPagination<EnvironmentConfig>
  })
  async getByQueryConfigs(@Query() query: QueryDto) {
    return await this.environmentConfigService.findByQuery(query)
  }

  @Post('admin')
  @HttpCode(200)
  @Public(false)
  @Roles(UserRole.admin)
  @UseGuards(AuthGuard, RoleGuard)
  @ApiCookieAuth(cookies.accessToken)
  @ApiOperation({
    summary: 'Admin: Create environment config'
  })
  create(@Body() dto: CreateConfigDto) {
    return this.environmentConfigService.create(dto)
  }

  @Patch('admin/:id')
  @HttpCode(200)
  @Public(false)
  @Roles(UserRole.admin)
  @UseGuards(AuthGuard, RoleGuard)
  @ApiCookieAuth(cookies.accessToken)
  @ApiOperation({
    summary: 'Admin: Update environment config by ID'
  })
  update(@Param('id') id: string, @Body() dto: CreateConfigDto) {
    return this.environmentConfigService.update(id, dto)
  }

  @Delete('admin/:id')
  @HttpCode(200)
  @Public(false)
  @Roles(UserRole.admin)
  @UseGuards(AuthGuard, RoleGuard)
  @ApiCookieAuth(cookies.accessToken)
  @ApiOperation({
    summary: 'Admin: Delete environment config by ID'
  })
  delete(@Param('id') id: string) {
    const config = this.environmentConfigService.findById(id)
    if (!config)
      throw new HttpException('config_not_found', HttpStatus.NOT_FOUND)

    return this.environmentConfigService.delete(id)
  }
}
