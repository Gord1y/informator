import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Put,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { FileInterceptor } from '@nestjs/platform-express'
import {
  ApiCookieAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags
} from '@nestjs/swagger'
import { User, UserRole } from '@prisma/client'
import { cookies } from 'src/common/constants/cookies'
import { CurrentUser } from 'src/common/decorators/current-user.decorator'
import { Public } from 'src/common/decorators/is-public.decorator'
import { Roles } from 'src/common/decorators/roles.decorator'
import { AuthGuardWithIgnore } from 'src/common/guards/auth-with-ignore.guard'
import { AuthGuard } from 'src/common/guards/auth.guard'
import { RoleGuard } from 'src/common/guards/role.guard'
import { QueryDto } from 'src/dtos/pagination/query.dto'
import { ResultWithPagination } from 'src/dtos/pagination/result-with-pagination.dto'

import { AwsS3Service } from '../aws-s3/aws-s3.service'

import { HandleBlockDto } from './dto/handle-block-user.dto'
import { UpdateSelfDto } from './dto/update-self.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { UserService } from './user.service'

@Controller('user')
@ApiTags('Users Controller')
export class UserController {
  private bucketName = ''
  constructor(
    private readonly userService: UserService,
    private readonly awsS3Service: AwsS3Service,
    private readonly configService: ConfigService
  ) {
    this.bucketName = this.configService.get('AWS_BUCKET')
  }

  @Get()
  @Public(false)
  @UseGuards(AuthGuard)
  @ApiCookieAuth(cookies.accessToken)
  @ApiOperation({
    summary: 'Get current user'
  })
  async getCurrentUser(@CurrentUser('id') id: string) {
    return this.userService.returnUserFields(
      await this.userService.findById(id)
    )
  }

  @Get('role')
  @Public(false)
  @UseGuards(AuthGuardWithIgnore)
  @ApiCookieAuth(cookies.accessToken)
  @ApiOperation({
    summary: 'Get current user role'
  })
  async getCurrentUserRole(@CurrentUser('role') role: string) {
    return {
      role
    }
  }

  @Put('avatar')
  @Public(false)
  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('avatar'))
  @ApiCookieAuth(cookies.accessToken)
  @ApiOperation({
    summary: 'Update current user avatar'
  })
  async updateAvatar(
    @CurrentUser() user: User,
    @UploadedFile() file: Express.Multer.File
  ) {
    if (user.avatar && user.avatar.key) {
      await this.awsS3Service.deleteFile(
        this.bucketName,
        `avatars/${user.avatar.key}`
      )
    }

    if (!file) {
      return this.userService.returnUserFields(
        await this.userService.update(user.id, {
          avatar: null
        })
      )
    }

    const avatar = await this.awsS3Service.uploadFile(
      this.bucketName,
      `avatars/${user.id}-${file.originalname}`,
      file.buffer
    )

    return this.userService.returnUserFields(
      await this.userService.update(user.id, {
        avatar
      })
    )
  }

  @Patch()
  @Public(false)
  @UseGuards(AuthGuard)
  @ApiCookieAuth(cookies.accessToken)
  @ApiParam({
    name: 'userId',
    required: true
  })
  @ApiOperation({
    summary: 'Update current user'
  })
  async updateUser(@CurrentUser('id') id: string, @Body() data: UpdateSelfDto) {
    return this.userService.returnUserFields(
      await this.userService.update(id, {
        ...data
      })
    )
  }

  @Delete()
  @Public(false)
  @UseGuards(AuthGuard)
  @ApiCookieAuth(cookies.accessToken)
  @ApiOperation({
    summary: 'Delete current user'
  })
  async deleteUser(@CurrentUser('id') id: string) {
    return this.userService.returnUserFields(await this.userService.delete(id))
  }

  @Get('admin')
  @Public(false)
  @Roles(UserRole.admin)
  @UseGuards(AuthGuard, RoleGuard)
  @ApiCookieAuth(cookies.accessToken)
  @ApiOperation({
    summary: 'admin: Get users by query'
  })
  @ApiResponse({
    status: 200,
    description: 'Return users by query',
    type: ResultWithPagination<User>
  })
  async getWithQuery(@Query() query: QueryDto) {
    return await this.userService.findByQuery(query)
  }

  @Get('admin/:userId')
  @Public(false)
  @Roles(UserRole.admin)
  @UseGuards(AuthGuard, RoleGuard)
  @ApiCookieAuth(cookies.accessToken)
  @ApiParam({
    name: 'userId',
    required: true
  })
  @ApiOperation({
    summary: 'admin: Get user by userId'
  })
  async getUserById(@Param('userId') userId: string) {
    return this.userService.returnUserFields(
      await this.userService.findById(userId),
      true
    )
  }

  @Patch('admin/:userId')
  @Public(false)
  @Roles(UserRole.admin)
  @UseGuards(AuthGuard, RoleGuard)
  @ApiCookieAuth(cookies.accessToken)
  @ApiOperation({
    summary: 'admin: Update user by userId'
  })
  async updateUserById(
    @Param('userId') userId: string,
    @Body() data: UpdateUserDto,
    @CurrentUser() admin: User
  ) {
    const user = await this.userService.findById(userId)
    if (!user) throw new NotFoundException('User not found')

    if (
      data.role === UserRole.admin &&
      admin.email !== this.configService.get('APP_SUPER_ADMIN_EMAIL')
    )
      throw new BadRequestException('You can not change user role')

    await this.userService.update(user.id, {
      ...data
    })

    return {
      message: 'User updated successfully'
    }
  }

  @Patch('admin/:userId/handleBan')
  @Public(false)
  @Roles(UserRole.admin)
  @UseGuards(AuthGuard, RoleGuard)
  @ApiCookieAuth(cookies.accessToken)
  @ApiOperation({
    summary: 'admin: Ban user by userId'
  })
  async handleBan(@Param('userId') userId: string) {
    const user = await this.userService.findById(userId)
    if (!user) throw new BadRequestException('User not found')

    await this.userService.handleBan(user.id, !user.isBanned)

    return {
      message: `User ${user.isBanned ? 'unbanned' : 'banned'} successfully`
    }
  }

  @Patch('admin/:userId/handleBlock')
  @Public(false)
  @Roles(UserRole.admin)
  @UseGuards(AuthGuard, RoleGuard)
  @ApiCookieAuth(cookies.accessToken)
  @ApiOperation({
    summary: 'admin: Block user by userId'
  })
  async handleBlock(
    @Param('userId') userId: string,
    @Body() dto: HandleBlockDto
  ) {
    const user = await this.userService.findById(userId)
    if (!user) throw new BadRequestException('User not found')

    await this.userService.handleTempBlock(user.id, dto.blockedUntil)

    return {
      message: `User ${dto.blockedUntil ? 'blocked' : 'unblocked'} successfully`
    }
  }

  @Delete('admin/:userId')
  @Public(false)
  @Roles(UserRole.admin)
  @UseGuards(AuthGuard, RoleGuard)
  @ApiCookieAuth(cookies.accessToken)
  @ApiParam({
    name: 'userId',
    required: true
  })
  @ApiOperation({
    summary: 'admin: Delete user by userId'
  })
  async deleteUserById(@Param('userId') userId: string) {
    const user = await this.userService.findById(userId)
    if (!user) throw new BadRequestException('User not found')

    await this.userService.delete(userId)

    return {
      message: 'User deleted successfully'
    }
  }
}
