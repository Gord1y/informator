import { Injectable } from '@nestjs/common'
import { Cron, CronExpression } from '@nestjs/schedule'

import { PrismaService } from '../prisma/prisma.service'

@Injectable()
export class OtpCleanupService {
  constructor(private prisma: PrismaService) {}

  @Cron(CronExpression.EVERY_DAY_AT_NOON)
  async handleCron() {
    const count = await this.prisma.otp.deleteMany({
      where: {
        AND: [
          {
            otpBlockUntil: {
              lt: new Date()
            }
          },
          {
            otpBlockUntil: {
              gte: new Date(Date.now() - 12 * 60 * 60 * 1000)
            }
          }
        ]
      }
    })
    console.log('[OTP cleanup] Cleaned up old OTPs, count:', count.count)
  }
}
