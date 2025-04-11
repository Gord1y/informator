import { ApiProperty } from '@nestjs/swagger'
import { Gender } from '@prisma/client'
import { IsEnum, IsOptional, IsString } from 'class-validator'

export class UpdateSelfDto {
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
}
