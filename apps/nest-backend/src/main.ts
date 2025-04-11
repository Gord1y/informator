import { ValidationPipe } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'
import { NestExpressApplication } from '@nestjs/platform-express'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import helmet from 'helmet'

import { AppModule } from './modules/app/app.module'
import { WsService } from './services/ws.service'

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule)
  const configService = app.get(ConfigService)

  const wsService = app.get(WsService)
  wsService.start(app.getHttpServer())

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true
    })
  )

  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"]
        }
      },
      hsts: {
        maxAge: 31536000,
        includeSubDomains: true
      },
      frameguard: {
        action: 'deny'
      },
      referrerPolicy: {
        policy: 'same-origin'
      }
    })
  )

  const isProduction = configService.getOrThrow('APP_ENV') == 'production'
  const allowedOrigins = isProduction
    ? ['http://localhost:3000', 'http://localhost']
    : [
        'http://localhost:3000',
        'http://localhost:3060',
        'http://localhost:5173',
        'http://localhost'
      ]

  app.enableCors({
    origin: (origin, callback) => {
      if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
        callback(null, true)
      } else {
        callback(new Error('Not allowed by CORS'))
      }
    },
    credentials: true,
    allowedHeaders:
      'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept, Observe, Authorization, Set-Cookie, Cookie',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    preflightContinue: false,
    optionsSuccessStatus: 204,
    maxAge: 3600,
    exposedHeaders: ['Set-Cookie', 'Content-Range', 'X-Content-Range']
  })

  //swagger for API documentation
  if (!isProduction) {
    const config = new DocumentBuilder()
      .setTitle('NestJs API')
      .setContact('Dania Gordienko', 'https://gord1y.dev', 'gordiyvl@gmail.com')
      .setLicense('Copyleft', 'https://www.gnu.org/licenses/copyleft.en.html')
      .setVersion('1.0')
      .addCookieAuth('accessToken', {
        type: 'apiKey',
        description: 'Access token for user authentication',
        name: 'accessToken'
      })
      .build()
    const document = SwaggerModule.createDocument(app, config)
    SwaggerModule.setup('api', app, document)
  }

  try {
    const appPort = configService.get('APP_PORT') || 4000
    await app.listen(appPort, () => {
      console.log(`App is running on: http://localhost:${appPort}`)
      if (!isProduction) {
        console.log(`Swagger is running on: http://localhost:${appPort}/api`)
      }
    })
  } catch (error) {
    console.error(error)
    process.exit(1)
  }
}

bootstrap()
