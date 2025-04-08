import { ApiProperty } from '@nestjs/swagger'
import { UserRole } from '@prisma/client'
import { IsEnum, IsOptional, IsString } from 'class-validator'

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  @ApiProperty()
  email?: string

  @IsString()
  @IsOptional()
  @ApiProperty()
  username?: string

  @IsEnum(UserRole)
  @IsOptional()
  @ApiProperty()
  role?: UserRole

  @IsString()
  @IsOptional()
  @ApiProperty()
  firstName?: string

  @IsString()
  @IsOptional()
  @ApiProperty()
  lastName?: string

  @IsString()
  @IsOptional()
  @ApiProperty()
  middleName?: string
}
