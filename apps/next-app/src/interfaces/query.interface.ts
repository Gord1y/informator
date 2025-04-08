export interface IQuery {
  isFullList?: boolean
  page: number
  perPage: number
  search?: string
  sortBy?: string
  order?: string
  dateFrom?: string
  dateTo?: string
}
