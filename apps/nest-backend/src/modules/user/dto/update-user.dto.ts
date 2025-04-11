import { ApiProperty } from '@nestjs/swagger'
import { Gender, UserRole } from '@prisma/client'
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

  @IsString()
  @IsOptional()
  @ApiProperty()
  firstName?: string

  @ApiProperty()
  @IsOptional()
  @IsString()
  lastName?: string

  @IsEnum(Gender)
  @IsOptional()
  @ApiProperty({
    enum: Gender,
    required: false
  })
  gender?: Gender

  @IsEnum(UserRole)
  @IsOptional()
  @ApiProperty()
  role?: UserRole
}
