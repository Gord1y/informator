import { ApiProperty } from '@nestjs/swagger'
import { IsEnum, IsOptional, IsString } from 'class-validator'

export class QueryDto {
  @IsEnum(['true', 'false'])
  @IsOptional()
  @ApiProperty({
    enum: ['true', 'false'],
    example: 'false',
    required: false
  })
  isFullList? = 'false'

  @IsString()
  @IsOptional()
  @ApiProperty({
    type: String,
    example: '1',
    required: false
  })
  page = '1'

  @IsString()
  @IsOptional()
  @ApiProperty({
    type: String,
    example: '15',
    required: false
  })
  perPage = '15'

  @IsString()
  @IsOptional()
  @ApiProperty({
    type: String,
    example: 'find me',
    required: false
  })
  search? = ''

  @IsString()
  @IsOptional()
  @ApiProperty({
    type: String,
    example: 'createdAt',
    required: false
  })
  sortBy = 'createdAt'

  @IsString()
  @IsOptional()
  @ApiProperty({
    type: String,
    example: 'desc',
    required: false
  })
  order = 'desc'

  @IsString()
  @IsOptional()
  @ApiProperty({
    type: String,
    example: '2021-01-01',
    required: false
  })
  dateFrom?: string

  @IsString()
  @IsOptional()
  @ApiProperty({
    type: String,
    example: '2021-01-31',
    required: false
  })
  dateTo?: string
}
