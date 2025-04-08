import { AdminNotificationsPayloads } from './event-types/admin.interface'

export interface EventPayloads extends AdminNotificationsPayloads {
  'auth.register': {
    email: string
    otp: string
    firstName: string
    lastName: string
  }
  'auth.login': {
    email: string
    otp: string
  }
  'user.welcome': {
    email: string
    firstName: string
    lastName: string
  }
}
