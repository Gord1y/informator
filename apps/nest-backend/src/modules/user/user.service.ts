/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@nestjs/common'
import { Prisma, User, UserRole } from '@prisma/client'
import { QueryDto } from 'src/dtos/pagination/query.dto'
import { QueryService } from 'src/services/query.service'

import { PrismaService } from '../prisma/prisma.service'

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly queryService: QueryService
  ) {}

  returnUserFields(user: User, isAdmin = false) {
    const {
      otp,
      otpUntil,
      otpResendCount,
      otpBlockUntil,
      googleId,
      ...result
    } = user as User

    if (!isAdmin && result.role === UserRole.user) {
      delete result.role
      delete result.isBanned
      delete result.isBlocked
      delete result.blockedUntil
      delete result.createdAt
      delete result.updatedAt
    }

    return result
  }

  async findById(id: string) {
    return await this.prisma.user.findUnique({
      where: {
        id
      }
    })
  }

  async findByEmail(email: string) {
    return await this.prisma.user.findUnique({
      where: {
        email
      }
    })
  }

  async findByUsername(username: string) {
    return await this.prisma.user.findFirst({
      where: {
        username
      }
    })
  }

  async findByGoogleId(googleId: string) {
    return await this.prisma.user.findFirst({
      where: {
        googleId
      }
    })
  }

  async findByStreamKey(streamKey: string) {
    const decodedKey = Buffer.from(streamKey, 'base64').toString('utf-8')
    const email = decodedKey.split('-')[0]

    return await this.prisma.user.findUnique({
      where: {
        email,
        streamKey
      }
    })
  }

  async create(data: Prisma.UserCreateInput) {
    return await this.prisma.user.create({
      data: {
        ...data
      }
    })
  }

  async update(id: string, data: Prisma.UserUpdateInput) {
    return await this.prisma.user.update({
      where: {
        id
      },
      data
    })
  }

  async delete(id: string) {
    return await this.prisma.user.delete({
      where: {
        id
      }
    })
  }

  async findByQuery(query: QueryDto) {
    return await this.queryService.findByQuery<'user'>(query, 'User', {
      OR: [
        {
          email: {
            contains: query.search,
            mode: 'insensitive'
          }
        },
        {
          phone: {
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
          middleName: {
            contains: query.search,
            mode: 'insensitive'
          }
        }
      ]
    })
  }

  async handleBan(id: string, isBanned: boolean) {
    return await this.prisma.user.update({
      where: {
        id
      },
      data: {
        isBanned
      }
    })
  }

  async handleTempBlock(id: string, blockedUntil: Date) {
    return await this.prisma.user.update({
      where: {
        id
      },
      data: {
        isBlocked: new Date(blockedUntil) > new Date(),
        blockedUntil
      }
    })
  }
}
