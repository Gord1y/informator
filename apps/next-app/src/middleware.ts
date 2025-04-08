import { NextRequest, NextResponse } from 'next/server'

import { cookiesConstant } from './config/cookies.constants'
import {
  ADMIN_PAGES,
  AUTH_PAGES,
  DASHBOARD_PAGES
} from './config/pages-url.config'
import { UserRoleEnum } from './interfaces/user/role.enum'
import { ICurrentUser } from './interfaces/user/user.interface'

async function fetchCurrentUserRole(
  request: NextRequest
): Promise<UserRoleEnum | null> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/role`, {
      headers: {
        cookie: request.headers.get('cookie') ?? ''
      },
      method: 'GET',
      credentials: 'include'
    })
    if (!res.ok) {
      console.error('Failed to fetch user role, status:', res.status)
      return null
    }
    const data = await res.json()
    return data.role as UserRoleEnum
  } catch (err) {
    console.error('Error fetching user role:', err)
    return null
  }
}

export default async function middleware(request: NextRequest) {
  const { nextUrl, cookies } = request
  const pathname = nextUrl.pathname

  const staticFilePattern =
    /^\/(_next\/static|_next\/image|favicon\.ico|apple-touch-icon\.png|favicon\.svg|images\/books|icons|manifest|site\.webmanifest)/
  if (staticFilePattern.test(pathname)) {
    return NextResponse.next()
  }

  const userCookie = cookies.get(cookiesConstant.currentUser)?.value
  const accessToken = cookies.get('accessToken')?.value
  let currentUser: ICurrentUser = { authorized: false, user: null }
  try {
    if (userCookie) {
      currentUser = JSON.parse(userCookie)
    }
  } catch (error) {
    console.error('Error parsing currentUser cookie:', error)
  }

  const isAdminPage = pathname.startsWith(ADMIN_PAGES.HOME)
  const isDashboardPage = pathname.startsWith(DASHBOARD_PAGES.HOME)
  const isAuthPage = pathname.startsWith(AUTH_PAGES.HOME)

  if (currentUser.authorized && currentUser.user && accessToken) {
    const role = await fetchCurrentUserRole(request)

    if (!role) {
      if (!isAuthPage) {
        const redirectUrl = new URL(AUTH_PAGES.HOME, request.url)
        const res = NextResponse.redirect(redirectUrl)
        res.cookies.set(cookiesConstant.currentUser, '', {
          path: '/',
          maxAge: 0
        })
        return res
      }
      return NextResponse.next()
    }

    if (isAuthPage) {
      if (role === UserRoleEnum.admin) {
        return NextResponse.redirect(new URL(ADMIN_PAGES.HOME, request.url))
      } else {
        return NextResponse.redirect(new URL(DASHBOARD_PAGES.HOME, request.url))
      }
    }

    if (isAdminPage && role !== UserRoleEnum.admin) {
      return NextResponse.redirect(new URL('/404', request.url))
    }

    return NextResponse.next()
  } else {
    if (isDashboardPage || isAdminPage) {
      return NextResponse.redirect(new URL('/404', request.url))
    }
    return NextResponse.next()
  }
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|apple-touch-icon.png|favicon.svg|images/books|icons|manifest|site.webmanifest).*)'
  ]
}
