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
    name: 'Головна',
    href: '/',
    sitemapUrl: '',
    isMenu: true,
    isAuth: false,
    isFooter: true,
    changeFrequency: 'always',
    priority: 1
  },
  {
    name: 'Відгуки',
    href: '/reviews',
    isMenu: false,
    isAuth: false,
    isFooter: true,
    changeFrequency: 'weekly',
    priority: 0.7
  },
  {
    name: 'Про нас',
    href: '/about-us',
    isMenu: true,
    isAuth: false,
    isFooter: true,
    changeFrequency: 'weekly',
    priority: 0.7
  },
  {
    name: 'Контакти',
    href: '/contacts',
    isMenu: true,
    isAuth: false,
    isFooter: true,
    changeFrequency: 'weekly',
    priority: 0.7
  },
  {
    name: 'Категорії',
    href: '/category',
    isMenu: false,
    isAuth: false,
    isFooter: true,
    changeFrequency: 'daily',
    priority: 0.8
  },
  {
    name: 'Доставка та оплата',
    href: '/delivery-and-payment',
    isMenu: true,
    isAuth: false,
    isFooter: true,
    changeFrequency: 'weekly',
    priority: 0.7
  },
  {
    name: 'Питання та відповіді',
    href: '/questions',
    isMenu: true,
    isAuth: false,
    isFooter: true,
    changeFrequency: 'weekly',
    priority: 0.7
  },
  {
    name: 'Умови використання',
    href: '/policy',
    isMenu: false,
    isAuth: false,
    isFooter: true,
    changeFrequency: 'monthly',
    priority: 0.7
  },
  {
    name: 'Політика конфіденційності',
    href: '/policy',
    isMenu: false,
    isAuth: false,
    isFooter: true,
    changeFrequency: 'monthly',
    priority: 0.7
  },
  {
    name: 'Особистий кабінет',
    href: '/dashboard',
    isMenu: false,
    isAuth: true,
    isFooter: false,
    changeFrequency: 'daily',
    priority: 0.7
  },
  {
    name: 'Бонуси та промокоди',
    href: '/dashboard/bonuses-and-promo',
    isMenu: false,
    isAuth: true,
    isFooter: false,
    changeFrequency: 'daily',
    priority: 0.7
  },
  {
    name: 'Замовлення',
    href: '/dashboard/orders',
    isMenu: false,
    isAuth: true,
    isFooter: false,
    changeFrequency: 'daily',
    priority: 0.7
  },
  {
    name: 'Відгуки',
    href: '/dashboard/reviews',
    isMenu: false,
    isAuth: true,
    isFooter: false,
    changeFrequency: 'daily',
    priority: 0.7
  }
]
