import { Injectable, LoggerService as NestLoggerService } from '@nestjs/common'
import * as fs from 'fs'
import * as path from 'path'
import * as winston from 'winston'

import { RequestLogDto } from './dto/request.log.dto'
import { ResponseErrorLogDto } from './dto/response-error.log.dto'

// import { CustomFileTransport } from './custom-file.transport'

@Injectable()
export class LogsService implements NestLoggerService {
  private logger: winston.Logger
  private logFilePath: string

  constructor() {
    this.logFilePath = path.resolve('logs', 'logs.jsonl')
    this.logger = winston.createLogger({
      level: 'info',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
      ),
      transports: [
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.colorize(),
            winston.format.printf(({ level, message, timestamp }) => {
              return `${timestamp} [${level}]: ${message}`
            })
          )
        })
        // new CustomFileTransport({
        //   filename: this.logFilePath,
        //   maxLogsCount: 5000,
        //   level: 'info'
        // })
      ]
    })
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  log(message: any, context?: string) {
    this.logger.info(
      typeof message === 'object' ? JSON.stringify(message) : message,
      { context }
    )
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  error(message: any, trace?: string, context?: string) {
    this.logger.error(
      typeof message === 'object' ? JSON.stringify(message) : message,
      { trace, context }
    )
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  warn(message: any, context?: string) {
    this.logger.warn(
      typeof message === 'object' ? JSON.stringify(message) : message,
      { context }
    )
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  debug?(message: any, context?: string) {
    this.logger.debug(
      typeof message === 'object' ? JSON.stringify(message) : message,
      { context }
    )
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  verbose?(message: any, context?: string) {
    this.logger.verbose(
      typeof message === 'object' ? JSON.stringify(message) : message,
      { context }
    )
  }

  logRequest(requestLog: RequestLogDto) {
    this.logger.info(
      `Incoming Request ${requestLog.request_method} ${requestLog.request_url}`,
      { ...requestLog }
    )
  }

  logResponseError(responseErrorLog: ResponseErrorLogDto) {
    this.logger.error(
      `Incoming Request Error ${responseErrorLog.response_status} ${responseErrorLog.request_url}`,
      { ...responseErrorLog }
    )
  }

  async getLogsFromFile() {
    return new Promise((resolve, reject) => {
      fs.readFile(this.logFilePath, 'utf8', (err, data) => {
        if (err) {
          return reject(err)
        }
        const lines = data.split('\n').filter(line => line.trim() !== '')
        const logs = lines
          .map(line => {
            try {
              return JSON.parse(line)
            } catch {
              return null
            }
          })
          .filter(log => log !== null)
        resolve(logs)
      })
    })
  }
}
