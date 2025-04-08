import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit
} from '@nestjs/common'
import { Prisma, PrismaClient } from '@prisma/client'

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger(PrismaService.name)

  async onModuleInit() {
    try {
      await this.$connect()

      await this.user.findMany()
      this.logger.log('Connected to the database')
    } catch (error) {
      this.handlePrismaError(error)
    }
  }

  async onModuleDestroy() {
    await this.$disconnect()
    this.logger.log('Disconnected from the database')
  }

  private handlePrismaError(error: unknown) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      switch (error.code) {
        case 'P2002':
          this.logger.error('Unique constraint failed', error)
          break
        case 'P2025':
          this.logger.error('Record not found', error)
          break
        default:
          this.logger.error('Prisma client known request error', error)
          break
      }
    } else if (error instanceof Prisma.PrismaClientUnknownRequestError) {
      this.logger.error('Prisma client unknown request error', error)
    } else if (error instanceof Prisma.PrismaClientRustPanicError) {
      this.logger.error('Prisma client rust panic error', error)
    } else if (error instanceof Prisma.PrismaClientInitializationError) {
      this.logger.error('Prisma client initialization error', error)
    } else if (error instanceof Prisma.PrismaClientValidationError) {
      this.logger.error('Prisma client validation error', error)
    } else {
      this.logger.error('Unknown error', error)
    }
  }
}
