import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString } from 'class-validator'

export class GoogleCallbackDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  code: string
}
