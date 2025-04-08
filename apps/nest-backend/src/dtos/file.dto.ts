import { ApiProperty } from '@nestjs/swagger'
import { IsDateString, IsOptional, IsString } from 'class-validator'

export class FileDto {
  @IsString()
  @IsOptional()
  @ApiProperty({
    required: false
  })
  bucket?: string

  @IsString()
  @IsOptional()
  @ApiProperty({
    required: false
  })
  path?: string

  @IsString()
  @IsOptional()
  @ApiProperty({
    required: false
  })
  key?: string

  @IsString()
  @ApiProperty()
  url: string

  @IsDateString()
  @ApiProperty()
  createdAt: Date
}
