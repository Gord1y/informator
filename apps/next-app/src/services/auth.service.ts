import api from './api'
import { IUserFinalize } from '@/interfaces/user/finalize.interface'
import { IUserLogin } from '@/interfaces/user/login.interface'
import { IUserRegister } from '@/interfaces/user/register.interface'
import { IUserResponse } from '@/interfaces/user/response.interface'
import { IUser } from '@/interfaces/user/user.interface'

class AuthService {
  async finalizeLogin(data: IUserFinalize, login: (user: IUser) => void) {
    const resp = await api.post<IUserResponse>(`/auth/login/finalize`, data)
    if (resp.data && resp.data.user) login(resp.data.user)
    return resp
  }

  async finalizeRegister(data: IUserFinalize, login: (user: IUser) => void) {
    const resp = await api.post<IUserResponse>(`/auth/register/finalize`, data)
    if (resp.data && resp.data.user) login(resp.data.user)
    return resp
  }

  async googleCallback(code: string, login: (user: IUser) => void) {
    const resp = await api.post<IUserResponse>('/auth/google/callback', {
      code,
      type: process.env.NEXT_PUBLIC_APP_TYPE
    })
    if (resp.data && resp.data.user) login(resp.data.user)
    return resp
  }

  async login(data: IUserLogin) {
    return await api.post<IUserResponse>('/auth/login', data)
  }

  async register(data: IUserRegister) {
    return await api.post<IUserResponse>('/auth/register', data)
  }

  async updateTokens(login: (user: IUser) => void) {
    const resp = await api.post<IUserResponse>('/auth/update-tokens')
    if (resp.data && resp.data.user) login(resp.data.user)
    return resp
  }

  async logout(logout: () => void) {
    await api.post<IUserResponse>('/auth/logout')
    logout()
  }
}

export const authService = new AuthService()
