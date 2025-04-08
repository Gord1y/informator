import { ApiProperty } from '@nestjs/swagger'

import { Pagination } from './pagination.dto'

export class ResultWithPagination<T> {
  @ApiProperty({
    type: [Object],
    example: []
  })
  result: T[]

  @ApiProperty({
    type: Pagination,
    example: {
      page: 1,
      perPage: 15,
      total: 0,
      totalPages: 0,
      nextPage: 0
    }
  })
  pagination: Pagination
}
