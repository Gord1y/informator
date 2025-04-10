import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpException,
  Post,
  Query,
  Redirect,
  Res,
  UseGuards
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { ApiCookieAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { User } from '@prisma/client'
import { Response } from 'express'
import {
  cookies,
  cookiesClearOptions,
  cookiesOptions
} from 'src/common/constants/cookies'
import { CurrentUser } from 'src/common/decorators/current-user.decorator'
import { TypedEventEmitter } from 'src/common/event-emmiter/typed-event-emitter.service'
import { RefreshTokenGuard } from 'src/common/guards/refresh-token.guard'

import { UserService } from '../user/user.service'

import { AuthService } from './auth.service'
import { AuthFinalizeDto } from './dto/finalize.dto'
import { GoogleCallbackDto } from './dto/google-callback.dto'
import { LoginDto } from './dto/login.dto'
import { RegisterDto } from './dto/register.dto'
import { OtpService } from './otp.service'

@Controller('auth')
@ApiTags('Auth Controller')
export class AuthController {
  private readonly redirectUrl: string
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly eventEmitter: TypedEventEmitter,
    private readonly otpService: OtpService,
    private readonly configService: ConfigService
  ) {
    const appUrl = this.configService.getOrThrow('CLIENT_URL')
    this.redirectUrl = `${appUrl}/auth/google/callback`
  }

  @Post('register')
  @HttpCode(200)
  @ApiOperation({ summary: 'Register a new user' })
  async register(@Body() dto: RegisterDto) {
    const existingUser = await this.userService.findByEmail(dto.email)

    if (existingUser) throw new HttpException('user_exists', 400)

    let existingOtp = await this.otpService.findOtp(dto.email)

    if (existingOtp) {
      if (existingOtp.otpBlockUntil > new Date()) {
        throw new HttpException('email_blocked_by_otp', 400)
      }
      if (existingOtp.otpResendCount >= 3) {
        await this.otpService.blockOtp(
          dto.email,
          new Date(Date.now() + 30 * 60 * 1000)
        ) // 30 minutes block
        throw new HttpException('otp_resend_limit_exceeded', 400)
      } else {
        existingOtp = await this.otpService.updateOtp(
          dto,
          existingOtp.otpResendCount + 1
        )
      }
    } else {
      existingOtp = await this.otpService.createOtp(dto)
    }

    this.eventEmitter.emit('auth.register', {
      email: dto.email,
      otp: existingOtp.otp,
      firstName: dto.firstName,
      lastName: dto.lastName
    })

    console.log(
      `[auth] OTP sent to ${dto.email} - ${existingOtp.otp} - ${existingOtp.otpUntil}`
    )

    return { message: 'otp_sent' }
  }

  @Post('register/finalize')
  @HttpCode(200)
  @ApiOperation({ summary: 'Finalize registration' })
  async finalizeRegister(@Res() res: Response, @Body() dto: AuthFinalizeDto) {
    const existingUser = await this.userService.findByEmail(dto.email)

    if (existingUser) throw new HttpException('user_exists', 400)

    const otp = await this.otpService.validateOtp(dto.email, dto.otp)

    if (!otp) throw new HttpException('invalid_otp', 400)
    if (new Date() > otp.otpUntil) throw new HttpException('otp_expired', 400)

    await this.otpService.deleteOtp(dto.email)

    const user = await this.userService.create({
      email: otp.email,
      firstName: otp.firstName,
      lastName: otp.lastName
    })

    if (!user) throw new HttpException('user_not_created', 500)

    const tokens = await this.authService.generateTokens(user)

    res.cookie(
      cookies.accessToken,
      tokens.accessToken,
      cookiesOptions.accessToken
    )
    res.cookie(
      cookies.refreshToken,
      tokens.refreshToken,
      cookiesOptions.refreshToken
    )

    return res.status(200).json({
      user: this.userService.returnUserFields(user),
      message: 'registered_and_logged_in'
    })
  }

  @Post('login')
  @HttpCode(200)
  @ApiOperation({ summary: 'Login' })
  async login(@Body() dto: LoginDto) {
    const user = await this.userService.findByEmail(dto.email)
    if (!user) throw new HttpException('user_not_found', 404)

    if (user.otp) {
      if (user.otpBlockUntil > new Date()) {
        throw new HttpException('user_blocked_by_otp', 400)
      }
      if (user.otpResendCount >= 3) {
        await this.otpService.blockUser(
          user.id,
          new Date(Date.now() + 30 * 60 * 1000)
        ) // 30 minutes block
        throw new HttpException('otp_resend_limit_exceeded', 400)
      }
    }

    const updUser = await this.otpService.updateUserOtp(
      user.id,
      user.otpResendCount + 1
    )

    this.eventEmitter.emit('auth.login', {
      email: updUser.email,
      otp: updUser.otp
    })

    console.log(
      `[auth] OTP sent to ${dto.email} - ${updUser.otp} - ${updUser.otpUntil}`
    )

    return { message: 'otp_sent' }
  }

  @Post('login/finalize')
  @HttpCode(200)
  @ApiOperation({ summary: 'Finalize login' })
  async finalizeLogin(@Res() res: Response, @Body() dto: AuthFinalizeDto) {
    const user = await this.userService.findByEmail(dto.email)

    if (!user) throw new HttpException('user_not_found', 404)

    if (user.isBanned) throw new HttpException('user_banned', 403)
    if (user.isBlocked) {
      if (user.blockedUntil > new Date()) {
        throw new HttpException('user_blocked', 403)
      } else {
        await this.userService.update(user.id, { isBlocked: false })
      }
    }

    if (user.otp !== dto.otp) throw new HttpException('invalid_otp', 400)
    if (new Date() > user.otpUntil) throw new HttpException('otp_expired', 400)

    const tokens = await this.authService.generateTokens(
      await this.userService.update(user.id, {
        otp: null,
        otpResendCount: 0,
        otpUntil: null
      })
    )

    res.cookie(
      cookies.accessToken,
      tokens.accessToken,
      cookiesOptions.accessToken
    )
    res.cookie(
      cookies.refreshToken,
      tokens.refreshToken,
      cookiesOptions.refreshToken
    )

    return res.status(200).json({
      user: this.userService.returnUserFields(user),
      message: 'logged_in'
    })
  }

  @Post('update-tokens')
  @HttpCode(200)
  @UseGuards(RefreshTokenGuard)
  @ApiCookieAuth(cookies.refreshToken)
  @ApiOperation({ summary: 'Update tokens' })
  async updateTokens(@Res() res: Response, @CurrentUser() user: User) {
    if (user.isBanned) throw new HttpException('user_banned', 403)
    if (user.isBlocked) {
      if (user.blockedUntil > new Date()) {
        throw new HttpException('user_blocked', 403)
      } else {
        await this.userService.update(user.id, { isBlocked: false })
      }
    }

    const tokens = await this.authService.generateTokens(user)

    res.cookie(
      cookies.accessToken,
      tokens.accessToken,
      cookiesOptions.accessToken
    )
    res.cookie(
      cookies.refreshToken,
      tokens.refreshToken,
      cookiesOptions.refreshToken
    )
    res.cookie(
      cookies.currentUser,
      JSON.stringify({
        user: this.userService.returnUserFields(user),
        authorized: true
      }),
      cookiesOptions.currentUser
    )

    return res.status(200).json({
      user: this.userService.returnUserFields(user),
      message: 'tokens_updated'
    })
  }

  @Post('logout')
  @HttpCode(200)
  @ApiOperation({ summary: 'Logout' })
  async logout(@Res() res: Response) {
    res.clearCookie(cookies.accessToken, cookiesClearOptions.accessToken)
    res.clearCookie(cookies.refreshToken, cookiesClearOptions.refreshToken)
    res.clearCookie(cookies.currentUser, cookiesClearOptions.currentUser)

    return res.status(200).json({ message: 'logged_out' })
  }

  @Get('google')
  @Redirect()
  @ApiOperation({ summary: 'Google auth' })
  async googleAuth(@Query('redirect') redirect: string) {
    const state = encodeURIComponent(redirect)

    const googleAuthUrl = `https://accounts.google.com/o/oauth2/auth?client_id=${this.configService.getOrThrow('GOOGLE_CLIENT_ID')}&redirect_uri=${encodeURIComponent(
      this.redirectUrl
    )}&response_type=code&scope=email%20profile&state=${state}&access_type=offline&prompt=consent`

    return { url: googleAuthUrl }
  }

  @Post('google/callback')
  async googleAuthCallback(
    @Body() body: GoogleCallbackDto,
    @Res() res: Response
  ) {
    const { id_token } = await this.authService.getGoogleTokens(
      body.code,
      this.redirectUrl
    )
    const userInfo = await this.authService.verifyGoogleToken(
      id_token,
      this.redirectUrl
    )
    let user = await this.userService.findByGoogleId(userInfo.sub)
    if (!user) {
      user = await this.userService.findByEmail(userInfo.email)
    }
    if (!user) {
      user = await this.userService.create({
        email: userInfo.email,
        googleId: userInfo.sub,
        firstName: userInfo.given_name,
        lastName: userInfo.family_name,
        avatar: {
          url: userInfo.picture,
          createdAt: new Date()
        }
      })
    }

    if (!user) throw new HttpException('user_not_created', 500)

    if (!user.googleId)
      await this.userService.update(user.id, {
        googleId: userInfo.sub
      })

    const tokens = await this.authService.generateTokens(user)
    res.cookie(
      cookies.accessToken,
      tokens.accessToken,
      cookiesOptions.accessToken
    )
    res.cookie(
      cookies.refreshToken,
      tokens.refreshToken,
      cookiesOptions.refreshToken
    )

    return res.status(200).json({
      user: this.userService.returnUserFields(user),
      message: 'logged_in'
    })
  }
}
