import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';



import { RequestLogDto } from '../../modules/logs/dto/request.log.dto';
import { LogsService } from '../../modules/logs/logs.service';





function filterHeaders(headers: Request['headers']) {
  const filtered = { ...headers }
  delete filtered['authorization']
  delete filtered['cookie']
  delete filtered['set-cookie']
  return filtered
}

@Injectable()
export class LoggingMiddleware implements NestMiddleware {
  constructor(private readonly logger: LogsService) {}

  use(req: Request, res: Response, next: NextFunction) {
    res.on('finish', () => {
      const requestLog: RequestLogDto = {
        type: 'request',
        request_url: req.originalUrl,
        request_method: req.method,
        request_body: JSON.stringify(req.body),
        request_headers: JSON.stringify(filterHeaders(req.headers)),
        request_query: JSON.stringify(req.query),
        request_params: JSON.stringify(req.params),
        request_user_agent: req.headers['user-agent'] || '',
        request_ip: req.ip || '',
        request_origin:
          req.headers['origin'] || req.headers['referer'] || req.host || '',
        timestamp: new Date()
      }
      this.logger.logRequest(requestLog)
    })

    next()
  }
}