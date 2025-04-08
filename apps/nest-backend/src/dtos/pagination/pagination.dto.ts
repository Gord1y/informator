import { ApiProperty } from '@nestjs/swagger'
import { IsNumber } from 'class-validator'

export class Pagination {
  @IsNumber()
  @ApiProperty()
  page: number

  @IsNumber()
  @ApiProperty()
  perPage: number

  @IsNumber()
  @ApiProperty()
  total: number

  @IsNumber()
  @ApiProperty()
  totalPages: number

  @IsNumber()
  @ApiProperty()
  nextPage: number
}
