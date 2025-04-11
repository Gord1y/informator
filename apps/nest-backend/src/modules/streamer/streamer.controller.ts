import { Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common'
import { User } from '@prisma/client'
import { CurrentUser } from 'src/common/decorators/current-user.decorator'
import { AuthGuard } from 'src/common/guards/auth.guard'
import { QueryDto } from 'src/dtos/pagination/query.dto'

import { StreamerService } from './streamer.service'

@Controller('streamer')
export class StreamerController {
  constructor(private readonly streamerService: StreamerService) {}

  // TODO: Uncomment the following methods to add more functionality

  // @Get('top')
  // async findTop() {
  //   return await this.streamerService.findTop()
  // }

  // @Get('random')
  // async findRandom() {
  //   return await this.streamerService.findRandom()
  // }

  // @Get('featured')
  // async findFeatured() {
  //   return await this.streamerService.findFeatured()
  // }

  @Get()
  async findByQuery(@Query() query: QueryDto) {
    return await this.streamerService.findByQuery(query)
  }

  @Get('online')
  async findOnline() {
    return await this.streamerService.findOnline()
  }

  @Get(':username')
  async findById(@Param('username') username: string) {
    return await this.streamerService.findByUsername(username)
  }

  @Post('become')
  @UseGuards(AuthGuard)
  async becomeStreamer(@CurrentUser() user: User) {
    return await this.streamerService.becomeStreamer(user.id, user.email)
  }
}
