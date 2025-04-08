import axios from 'axios'

import { apiConfig } from './config'

const api = axios.create(apiConfig)

// Request interceptor remains unchanged
api.interceptors.request.use(
  config => config,
  error => Promise.reject(error)
)

api.interceptors.response.use(
  response => response,
  async error => {
    if (error.response) {
      const originalRequest = error.config
      const { status } = error.response

      if (originalRequest.url.includes('/auth/update-tokens')) {
        return Promise.reject(error)
      }

      const logout = async () => {
        try {
          await api.post('/auth/logout')
        } finally {
          if (typeof window !== 'undefined') {
            window.location.href = '/auth'
          }
        }
      }

      if (status === 401 && !originalRequest._retry) {
        originalRequest._retry = true
        try {
          const resp = await api.post('/auth/update-tokens')
          if (resp.status === 200) {
            return api(originalRequest)
          } else {
            throw new Error()
          }
        } catch {
          await logout()
        }
      } else if (status === 403) {
        await logout()
      } else if (status === 429) {
        if (typeof window !== 'undefined') {
          alert('Too many requests. Please try again later.')
        }
      }
    }
    return Promise.reject(error)
  }
)

export default api
