import { HttpException, Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Prisma } from '@prisma/client'
import axios from 'axios'
import { PrismaService } from 'src/modules/prisma/prisma.service'

@Injectable()
export class IpService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService
  ) {}

  async getDetails(ip: string) {
    try {
      if (this.configService.get('APP_ENV') !== 'production') {
        return {
          ip: ip,
          city: 'Test City',
          region: 'Test Region',
          region_code: 'TR',
          country_code: 'TR',
          country_name: 'Turkey',
          continent_code: 'EU',
          in_eu: true,
          postal: '12345',
          timezone: 'Europe/Istanbul',
          currency: 'TRY'
        }
      }

      const resp = await axios.get<{
        ip: string
        city: string
        region: string
        region_code: string
        country_code: string
        country_code_iso3: string
        country_name: string
        country_capital: string
        country_tld: string
        continent_code: string
        in_eu: boolean
        postal: string
        latitude: number
        longitude: number
        timezone: string
        utc_offset: string
        country_calling_code: string
        currency: string
        currency_name: string
        languages: string
        asn: string
        org: string
      }>(`https://ipapi.co/${ip}/json/`)

      if (!resp.data) {
        throw new HttpException('Failed to get IP details', 500)
      }

      return resp.data
    } catch {
      throw new HttpException('Failed to get IP details', 500)
    }
  }

  async getOrCreate(ip: string) {
    const dbIP = await this.prisma.ipAddress.findFirst({
      where: { value: ip }
    })

    if (!dbIP) {
      const details = await this.getDetails(ip)

      return await this.prisma.ipAddress.create({
        data: details
          ? {
              value: ip,
              city: details.city,
              region: details.region,
              region_code: details.region_code,
              country_code: details.country_code,
              country_name: details.country_name,
              continent_code: details.continent_code,
              in_eu: details.in_eu,
              postal: details.postal,
              timezone: details.timezone,
              currency: details.currency
            }
          : {
              value: ip
            }
      })
    }

    if (!dbIP.country_code) {
      const details = await this.getDetails(ip)

      if (details) {
        await this.prisma.ipAddress.update({
          where: { value: ip },
          data: {
            city: details.city,
            region: details.region,
            region_code: details.region_code,
            country_code: details.country_code,
            country_name: details.country_name,
            continent_code: details.continent_code,
            in_eu: details.in_eu,
            postal: details.postal,
            timezone: details.timezone,
            currency: details.currency
          }
        })
      }
    }

    return dbIP
  }

  async update(id: string, data: Prisma.IpAddressUpdateInput) {
    return await this.prisma.ipAddress.update({
      where: { id },
      data
    })
  }
}
