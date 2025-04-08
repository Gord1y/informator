import { Injectable } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { QueryDto } from 'src/dtos/pagination/query.dto'
import { PrismaService } from 'src/modules/prisma/prisma.service'

@Injectable()
export class QueryService {
  constructor(private readonly prisma: PrismaService) {}

  async findByQuery<T extends keyof PrismaService>(
    query: QueryDto,
    modelName: Prisma.ModelName,
    where: Prisma.Args<T, 'findMany'>['where'] = {},
    include: Prisma.Args<T, 'findMany'>['include'] = {}
  ) {
    const page = parseInt(query.page) || 1,
      perPage = parseInt(query.perPage) || 10,
      sortBy = query.sortBy || 'createdAt',
      order = query.order || 'desc',
      isFullList = query.isFullList === 'true',
      dateFrom = query.dateFrom ? new Date(query.dateFrom) : undefined,
      dateTo = query.dateTo ? new Date(query.dateTo) : undefined

    //set hours to 0 if dateFrom is not null
    if (dateFrom) dateFrom.setHours(0, 0, 0, 0)
    //set hours to 23:59:59 if dateTo is not null
    if (dateTo) dateTo.setHours(23, 59, 59, 999)

    //make first letter of modelName lowercase
    const model = modelName.charAt(0).toLowerCase() + modelName.slice(1)

    if (isFullList) {
      return await this.prisma[model].findMany({
        orderBy: {
          [sortBy]: order
        },
        include
      })
    }

    const skip = (page - 1) * perPage
    const total = await this.prisma[model].count({
      where: {
        AND: [
          where,
          dateFrom && dateFrom !== undefined && dateTo && dateTo !== undefined
            ? {
                OR: [
                  { createdAt: { gte: dateFrom, lte: dateTo } },
                  { updatedAt: { gte: dateFrom, lte: dateTo } }
                ]
              }
            : {}
        ]
      }
    })
    const data = await this.prisma[model].findMany({
      skip,
      take: perPage,
      where: {
        AND: [
          where,
          dateFrom && dateFrom !== undefined && dateTo && dateTo !== undefined
            ? {
                OR: [
                  { createdAt: { gte: dateFrom, lte: dateTo } },
                  { updatedAt: { gte: dateFrom, lte: dateTo } }
                ]
              }
            : {}
        ]
      },
      include,
      orderBy: {
        [sortBy]: order
      }
    })

    return {
      result: data,
      pagination: {
        page,
        perPage,
        total,
        totalPages: Math.ceil(total / perPage),
        nextPage: page * perPage < total ? page + 1 : null
      }
    }
  }
}
