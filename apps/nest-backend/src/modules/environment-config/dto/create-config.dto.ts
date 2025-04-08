import { ApiProperty } from '@nestjs/swagger'
import { IsBoolean, IsOptional, IsString } from 'class-validator'

export class CreateConfigDto {
  @IsString()
  @ApiProperty()
  key: string

  @IsString()
  @IsOptional()
  @ApiProperty({
    required: false
  })
  value?: string

  @IsString()
  @IsOptional()
  @ApiProperty({
    required: false
  })
  description?: string

  @IsBoolean()
  @IsOptional()
  @ApiProperty({
    required: false
  })
  isHidden?: boolean
}
