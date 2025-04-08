class ADMIN {
  private readonly root = '/admin'

  HOME = this.root
}
export const ADMIN_PAGES = new ADMIN()

class DASHBOARD {
  private readonly root = '/dashboard'

  HOME = this.root
}
export const DASHBOARD_PAGES = new DASHBOARD()

class AUTH {
  private readonly root = '/auth'

  HOME = this.root
}
export const AUTH_PAGES = new AUTH()
