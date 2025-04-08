export interface IResultWithPagination<T> {
  result: T[]
  pagination: IPagination
}

export interface IPagination {
  page: number
  perPage: number
  total: number
  totalPages: number
  nextPage: number | null
}
