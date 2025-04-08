import { ApiProperty } from '@nestjs/swagger'
import { IsDateString } from 'class-validator'

export class HandleBlockDto {
  @IsDateString()
  @ApiProperty()
  blockedUntil: Date
}
