import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/modules/prisma/prisma.service'

import { RegisterDto } from './dto/register.dto'

@Injectable()
export class OtpService {
  private readonly validDuration = 5 * 60 * 1000 // 5 minutes
  constructor(private readonly prisma: PrismaService) {}

  async findOtp(email: string) {
    return await this.prisma.otp.findUnique({
      where: {
        email
      }
    })
  }

  async validateOtp(email: string, otp: string) {
    const otpRecord = await this.prisma.otp.findUnique({
      where: {
        email,
        otp
      }
    })
    if (!otpRecord) {
      return null
    }
    return await this.prisma.otp.delete({
      where: {
        id: otpRecord.id
      }
    })
  }

  async generateOtp(length: number) {
    const digits = '0123456789'
    let otp = ''
    for (let i = 0; i < length; i++) {
      otp += digits[Math.floor(Math.random() * 10)]
    }

    const otpUntil = new Date(Date.now() + this.validDuration)

    return {
      otp,
      otpUntil
    }
  }

  async createOtp(dto: RegisterDto) {
    const generatedOtp = await this.generateOtp(6)

    return await this.prisma.otp.create({
      data: {
        ...dto,
        ...generatedOtp
      }
    })
  }

  async updateOtp(dto: RegisterDto, otpResendCount: number) {
    const generatedOtp = await this.generateOtp(6)

    return await this.prisma.otp.update({
      where: {
        email: dto.email
      },
      data: {
        ...dto,
        ...generatedOtp,
        otpResendCount
      }
    })
  }

  async updateUserOtp(id: string, otpResendCount: number) {
    const generatedOtp = await this.generateOtp(6)

    return await this.prisma.user.update({
      where: {
        id
      },
      data: {
        ...generatedOtp,
        otpResendCount
      }
    })
  }

  async blockOtp(email: string, otpBlockUntil: Date) {
    return await this.prisma.otp.update({
      where: {
        email
      },
      data: {
        otpResendCount: 0,
        otpBlockUntil
      }
    })
  }

  async blockUser(id: string, otpBlockUntil: Date) {
    return await this.prisma.user.update({
      where: {
        id
      },
      data: {
        otpResendCount: 0,
        otpBlockUntil
      }
    })
  }

  async deleteOtp(email: string) {
    return await this.prisma.otp.delete({
      where: {
        email
      }
    })
  }
}
