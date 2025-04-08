import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus
} from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { Response } from 'express'

import { LogsService } from '../../modules/logs/logs.service'

interface CustomException {
  status?: number
  message?: string
  name?: string
  stack?: string
}

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(private readonly logger: LogsService) {}

  catch(
    exception:
      | Prisma.PrismaClientKnownRequestError
      | CustomException
      | HttpException,
    host: ArgumentsHost
  ) {
    const ctx = host.switchToHttp(),
      response = ctx.getResponse<Response>(),
      request = ctx.getRequest()

    let statusCode: number
    let message: string
    let cause: CustomException | string | unknown
    let errCode: number

    if (exception instanceof HttpException) {
      statusCode = exception.getStatus()
      errCode = statusCode
      message = exception.message
      const response = exception.getResponse()

      if (
        typeof response === 'object' &&
        response !== null &&
        'message' in response
      ) {
        cause = response
        if (Array.isArray(response.message)) {
          message = response.message.join(', ')
        }
      } else {
        cause = {
          name: exception.name,
          message: exception.message,
          stack: exception.stack
        }
      }
    } else if (exception instanceof TypeError) {
      statusCode = HttpStatus.INTERNAL_SERVER_ERROR
      errCode = 500
      message = 'Internal server error'
      cause = {
        name: exception.name,
        message: exception.message,
        stack: exception.stack
      }
    } else if (exception instanceof Prisma.PrismaClientKnownRequestError) {
      switch (exception.code) {
        case 'P2002':
          statusCode = HttpStatus.CONFLICT
          errCode = 2002
          message = 'Unique constraint failed on the provided fields'
          break
        case 'P2025':
          statusCode = HttpStatus.NOT_FOUND
          errCode = 2025
          message = 'Record not found'
          break
        case 'P2023':
          statusCode = HttpStatus.BAD_REQUEST
          errCode = 2023
          message = 'Record already exists'
          break
        case 'P2016':
          statusCode = HttpStatus.BAD_REQUEST
          errCode = 2016
          message = 'Record not found'
          break
        case 'P2003':
          statusCode = HttpStatus.BAD_REQUEST
          errCode = 2003
          message = 'Foreign key constraint failed on the field'
          break
        case 'P2000':
          statusCode = HttpStatus.BAD_REQUEST
          errCode = 2000
          message = 'Required field is not provided'
          break
        default:
          statusCode = HttpStatus.INTERNAL_SERVER_ERROR
          errCode = 500
          message = 'Internal server error'
          break
      }
      cause = {
        meta: exception.meta,
        message: exception.message
      }
    } else {
      statusCode = exception.status || HttpStatus.INTERNAL_SERVER_ERROR
      errCode = statusCode
      message = exception.message || 'Internal server error'
      cause = {
        name: exception.name,
        message: exception.message,
        stack: exception.stack
      }
    }

    // const responseErrorLog: ResponseErrorLogDto = {
    //   type: 'response_error',
    //   request_url: request.originalUrl,
    //   request_method: request.method,
    //   response_status: statusCode,
    //   response_code: `${errCode}`,
    //   response_message: message,
    //   response_error: cause,
    //   timestamp: new Date(),
    //   request_body: JSON.stringify(request.body),
    //   request_headers: JSON.stringify(request.headers),
    //   request_query: JSON.stringify(request.query),
    //   request_params: JSON.stringify(request.params),
    //   request_user_agent: request.headers['user-agent'] || '',
    //   request_ip:
    //     request.ip ||
    //     request.ips.join(', ') ||
    //     '' ||
    //     request.headers['x-forwarded-for'] ||
    //     '',
    //   request_origin:
    //     request.headers['origin'] || request.headers['referer'] || ''
    // }

    // this.logger.logResponseError(responseErrorLog)

    response.status(statusCode).json({
      error: {
        timestamp: new Date().toISOString(),
        request_url: request.url,
        request_method: request.method,
        message: message,
        statusCode: statusCode,
        errorCode: errCode,
        cause: cause
      }
    })
  }
}
