export class RequestLogDto {
  type: 'request'
  request_url: string
  request_method: string
  request_body: string
  request_headers: string
  request_query: string
  request_params: string
  request_user_agent: string
  request_ip: string
  request_origin: string
  timestamp: Date
}
