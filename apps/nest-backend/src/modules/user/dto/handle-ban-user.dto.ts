import { ApiProperty } from '@nestjs/swagger'
import { IsBoolean, IsNotEmpty, IsString } from 'class-validator'

export class HandleBanDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  userId: string

  @IsBoolean()
  @IsNotEmpty()
  @ApiProperty()
  isBanned: boolean
}
