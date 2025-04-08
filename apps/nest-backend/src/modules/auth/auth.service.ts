import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import { User } from '@prisma/client'
import { Auth, google } from 'googleapis'

@Injectable()
export class AuthService {
  oauth2Client: Auth.OAuth2Client

  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService
  ) {}

  private async generateAccessToken(user: User) {
    return this.jwtService.sign(
      { id: user.id },
      {
        secret: this.configService.get('JWT_ACCESS_TOKEN_SECRET'),
        expiresIn: this.configService.get('JWT_ACCESS_TOKEN_EXPIRATION_TIME')
      }
    )
  }

  private async generateRefreshToken(user: User) {
    return this.jwtService.sign(
      { id: user.id },
      {
        secret: await this.configService.get('JWT_REFRESH_TOKEN_SECRET'),
        expiresIn: await this.configService.get(
          'JWT_REFRESH_TOKEN_EXPIRATION_TIME'
        )
      }
    )
  }

  async generateTokens(user: User) {
    const accessToken = await this.generateAccessToken(user)
    const refreshToken = await this.generateRefreshToken(user)
    return {
      accessToken,
      refreshToken
    }
  }

  async getGoogleTokens(code: string, redirectUri: string) {
    this.oauth2Client = new google.auth.OAuth2(
      this.configService.get('GOOGLE_CLIENT_ID'),
      this.configService.get('GOOGLE_CLIENT_SECRET'),
      redirectUri
    )

    const { tokens } = await this.oauth2Client.getToken(code)

    return tokens
  }

  async verifyGoogleToken(idToken: string, redirectUri: string) {
    this.oauth2Client = new google.auth.OAuth2(
      this.configService.get('GOOGLE_CLIENT_ID'),
      this.configService.get('GOOGLE_CLIENT_SECRET'),
      redirectUri
    )

    const ticket = await this.oauth2Client.verifyIdToken({
      idToken,
      audience: this.configService.get('GOOGLE_CLIENT_ID')
    })
    return ticket.getPayload()
  }
}
