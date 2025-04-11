interface IPage {
  name: string
  href: string
  sitemapUrl?: string
  isMenu: boolean
  isAuth: boolean
  isFooter: boolean
  changeFrequency:
    | 'always'
    | 'hourly'
    | 'daily'
    | 'weekly'
    | 'monthly'
    | 'yearly'
    | 'never'
  priority: number
}
export const PAGES: IPage[] = [
  {
    name: 'Home',
    href: '/',
    sitemapUrl: '',
    isMenu: true,
    isAuth: false,
    isFooter: true,
    changeFrequency: 'always',
    priority: 1
  },
  {
    name: 'About Us',
    href: '/about-us',
    isMenu: true,
    isAuth: false,
    isFooter: true,
    changeFrequency: 'weekly',
    priority: 0.7
  },
  {
    name: 'Contact Us',
    href: '/contacts',
    isMenu: true,
    isAuth: false,
    isFooter: true,
    changeFrequency: 'weekly',
    priority: 0.7
  },
  {
    name: 'Q&A',
    href: '/questions',
    isMenu: true,
    isAuth: false,
    isFooter: true,
    changeFrequency: 'weekly',
    priority: 0.7
  },
  {
    name: 'Terms of Service',
    href: '/policy',
    isMenu: false,
    isAuth: false,
    isFooter: true,
    changeFrequency: 'monthly',
    priority: 0.7
  },
  {
    name: 'Privacy Policy',
    href: '/policy',
    isMenu: false,
    isAuth: false,
    isFooter: true,
    changeFrequency: 'monthly',
    priority: 0.7
  },
  {
    name: 'Dashboard',
    href: '/dashboard',
    isMenu: false,
    isAuth: true,
    isFooter: false,
    changeFrequency: 'daily',
    priority: 0.7
  }
]
