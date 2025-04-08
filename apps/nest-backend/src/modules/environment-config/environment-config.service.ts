import { Injectable } from '@nestjs/common'
import { QueryDto } from 'src/dtos/pagination/query.dto'
import { PrismaService } from 'src/modules/prisma/prisma.service'
import { QueryService } from 'src/services/query.service'

import { CreateConfigDto } from './dto/create-config.dto'

@Injectable()
export class EnvironmentConfigService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly queryService: QueryService
  ) {}

  async findById(id: string) {
    return await this.prisma.environmentConfig.findUnique({
      where: { id }
    })
  }

  async findByKey(key: string) {
    return await this.prisma.environmentConfig.findUnique({
      where: { key }
    })
  }

  async findByQuery(query: QueryDto) {
    return await this.queryService.findByQuery<'environmentConfig'>(
      query,
      'EnvironmentConfig',
      {
        OR: [
          {
            key: {
              contains: query.search
            }
          },
          {
            value: {
              contains: query.search
            }
          }
        ]
      }
    )
  }

  async create(dto: CreateConfigDto) {
    return await this.prisma.environmentConfig.create({
      data: {
        ...dto
      }
    })
  }

  async update(id: string, dto: CreateConfigDto) {
    return await this.prisma.environmentConfig.update({
      where: {
        id
      },
      data: {
        ...dto
      }
    })
  }

  async delete(id: string) {
    return await this.prisma.environmentConfig.delete({
      where: {
        id
      }
    })
  }
}
