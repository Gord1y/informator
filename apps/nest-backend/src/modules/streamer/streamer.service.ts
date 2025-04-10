import { Injectable } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { QueryDto } from 'src/dtos/pagination/query.dto'
import { QueryService } from 'src/services/query.service'

import { PrismaService } from '../prisma/prisma.service'

@Injectable()
export class StreamerService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly queryService: QueryService
  ) {}

  private selectUserFields = {
    firstName: true,
    lastName: true,
    username: true,
    avatar: true,
    streamKey: true,
    isStreamActive: true
  } as Prisma.UserSelect

  async findOnline() {
    return await this.prisma.user.findMany({
      where: {
        streamKey: {
          not: null
        },
        isStreamActive: true
      }
    })
  }

  generateStreamKey(email: string) {
    const key = `${email}-${new Date().getTime()}`
    return Buffer.from(key).toString('base64')
  }

  async becomeStreamer(userId: string) {
    return await this.prisma.user.update({
      where: {
        id: userId
      },
      data: {
        streamKey: this.generateStreamKey(userId)
      }
    })
  }

  async findByUsername(username: string) {
    return await this.prisma.user.findUnique({
      where: {
        username
      },
      select: this.selectUserFields
    })
  }

  async findByQuery(query: QueryDto) {
    return await this.queryService.findByQuery<'user'>(
      query,
      'User',
      {
        streamKey: {
          not: null
        },
        OR: [
          {
            email: {
              contains: query.search,
              mode: 'insensitive'
            }
          },
          {
            firstName: {
              contains: query.search,
              mode: 'insensitive'
            }
          },
          {
            lastName: {
              contains: query.search,
              mode: 'insensitive'
            }
          },
          {
            username: {
              contains: query.search,
              mode: 'insensitive'
            }
          }
        ]
      },
      this.selectUserFields
    )
  }
}
