import { CookieOptions } from 'express'

export const cookies = {
  accessToken: 'accessToken',
  refreshToken: 'refreshToken',
  currentUser: 'currentUser'
}

export const cookiesOptions: {
  [key: string]: CookieOptions
} = {
  accessToken: {
    httpOnly: true,
    path: '/',
    sameSite: 'lax',
    secure: process.env.APP_ENV === 'production',
    domain:
      process.env.APP_ENV == 'production' ? `.${process.env.SITE_DOMAIN}` : '',
    maxAge: 604800000 // 7 days
  },
  refreshToken: {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.APP_ENV === 'production',
    path: '/auth/update-tokens',
    domain:
      process.env.APP_ENV == 'production' ? `.${process.env.SITE_DOMAIN}` : '',
    maxAge: 604800000 // 7 days
  },
  currentUser: {
    httpOnly: false,
    sameSite: 'lax',
    secure: process.env.APP_ENV === 'production',
    path: '/',
    domain:
      process.env.APP_ENV === 'production' ? `.${process.env.SITE_DOMAIN}` : '',
    maxAge: 604800000 // 7 days
  }
}

export const cookiesClearOptions: {
  [key: string]: CookieOptions
} = {
  accessToken: {
    httpOnly: true,
    path: '/',
    sameSite: 'lax',
    secure: process.env.APP_ENV === 'production',
    domain:
      process.env.APP_ENV === 'production' ? `.${process.env.SITE_DOMAIN}` : '',
    maxAge: 0,
    expires: new Date(0)
  },
  refreshToken: {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.APP_ENV === 'production',
    path: '/auth/update-tokens',
    domain:
      process.env.APP_ENV === 'production' ? `.${process.env.SITE_DOMAIN}` : '',
    maxAge: 0,
    expires: new Date(0)
  },
  currentUser: {
    httpOnly: false,
    sameSite: 'lax',
    secure: process.env.APP_ENV === 'production',
    path: '/',
    domain:
      process.env.APP_ENV === 'production' ? `.${process.env.SITE_DOMAIN}` : '',
    maxAge: 0,
    expires: new Date(0)
  }
}
