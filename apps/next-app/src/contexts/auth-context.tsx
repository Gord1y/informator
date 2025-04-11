import { getCookie, setCookie } from 'cookies-next'
import React, { createContext, useContext, useEffect, useState } from 'react'

import { cookiesConstant } from '@/config/cookies.constants'

import { ICurrentUser, IUser } from '@/interfaces/user/user.interface'

interface AuthContextType {
  currentUser: ICurrentUser
  login: (user: IUser) => void
  logout: () => void
  updateUser: (data: IUser) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{
  children: React.ReactNode
  initalState: ICurrentUser | null
}> = ({ children, initalState }) => {
  const [currentUser, setCurrentUser] = useState<ICurrentUser>(
    initalState || {
      authorized: false,
      user: null
    }
  )

  useEffect(() => {
    const cookie = getCookie(cookiesConstant.currentUser)
    if (cookie) {
      setCurrentUser(JSON.parse(cookie as string))
    }
  }, [])

  const login = (user: IUser) => {
    setCookie(
      cookiesConstant.currentUser,
      JSON.stringify({ user, authorized: true }),
      {
        httpOnly: false,
        sameSite: 'lax',
        secure: process.env.APP_ENV === 'production',
        path: '/',
        domain:
          process.env.APP_ENV === 'production'
            ? `.${process.env.NEXT_PUBLIC_SITE_DOMAIN}`
            : '',
        maxAge: 604800000 // 7 days
      }
    )
    setCurrentUser({ user, authorized: true })
  }

  const logout = () => {
    setCookie(
      cookiesConstant.currentUser,
      JSON.stringify({ user: null, authorized: false }),
      {
        httpOnly: false,
        sameSite: 'lax',
        secure: process.env.APP_ENV === 'production',
        path: '/',
        domain:
          process.env.APP_ENV === 'production'
            ? `.${process.env.NEXT_PUBLIC_SITE_DOMAIN}`
            : '',
        maxAge: 604800000 // 7 days
      }
    )
    setCurrentUser({ user: null, authorized: false })
  }

  const updateUser = (data: IUser) => {
    const updatedUser = { ...currentUser.user, ...data }
    setCookie(
      cookiesConstant.currentUser,
      JSON.stringify({ user: updatedUser, authorized: true }),
      {
        httpOnly: false,
        sameSite: 'lax',
        secure: process.env.APP_ENV === 'production',
        path: '/',
        domain:
          process.env.APP_ENV === 'production'
            ? `.${process.env.NEXT_PUBLIC_SITE_DOMAIN}`
            : '',
        maxAge: 604800000 // 7 days
      }
    )
    setCurrentUser({ user: updatedUser, authorized: true })
  }

  return (
    <AuthContext.Provider value={{ currentUser, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
