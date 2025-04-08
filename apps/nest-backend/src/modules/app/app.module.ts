import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { APP_FILTER, APP_GUARD } from '@nestjs/core'
import { EventEmitterModule } from '@nestjs/event-emitter'
import { ThrottlerModule } from '@nestjs/throttler'
import { TypedEventEmitterModule } from 'src/common/event-emmiter/typed-event-emitter.module'
import { HttpExceptionFilter } from 'src/common/filters/http-exception.filter'
import { CustomThrottlerGuard } from 'src/common/guards/custom-throttler.guard'
import { LoggingMiddleware } from 'src/common/middleware/logging.middleware'
import { WsService } from 'src/services/ws.service'

import { AuthModule } from '../auth/auth.module'
import { AwsS3Module } from '../aws-s3/aws-s3.module'
import { EnvironmentConfigModule } from '../environment-config/environment-config.module'
import { LogsModule } from '../logs/logs.module'
import { PrismaModule } from '../prisma/prisma.module'
import { SharedModule } from '../shared/shared.module'
import { UserModule } from '../user/user.module'

import { AppController } from './app.controller'
import { AppService } from './app.service'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 1000,
        limit: 30,
        blockDuration: 60
      }
    ]),
    LogsModule,
    SharedModule,
    AwsS3Module,
    EventEmitterModule.forRoot(),
    TypedEventEmitterModule,
    PrismaModule,
    EnvironmentConfigModule,
    AuthModule,
    UserModule
  ],
  controllers: [AppController],
  providers: [
    WsService,
    AppService,
    {
      provide: APP_GUARD,
      useClass: CustomThrottlerGuard
    },
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter
    }
  ]
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggingMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL })
  }
}
