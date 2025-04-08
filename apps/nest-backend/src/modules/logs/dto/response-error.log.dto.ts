export class ResponseErrorLogDto {
  type: 'response_error'
  response_status: number
  response_code: string
  response_message: string
  response_error:
    | {
        name: string
        message: string
        stack: string
      }
    | string
    | unknown

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
