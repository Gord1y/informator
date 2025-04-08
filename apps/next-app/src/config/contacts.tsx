import { BiLogoInstagram, BiLogoTelegram } from 'react-icons/bi'

export const CONTACTS = {
  email: 'support@graverse.com.ua',
  phone: {
    tel: '380672320752',
    formatted: '+38 (067)-232-07-52'
  },
  phone2: {
    tel: '380937742516',
    formatted: '+38 (093)-774-25-16'
  },
  telegram: 'https://t.me/Rogova_Lesia',
  telegram2: 'https://t.me/graverse_books',
  instagram: 'https://www.instagram.com/graverse.zt?igsh=bHdybnNubHAyeTYx',
  instagram2: 'https://www.instagram.com/graverse.books?igsh=Nm8xNHhkNGN4Y2pl'
}

export const CONTACTS_LINKS = [
  {
    name: 'Instagram',
    href: CONTACTS.instagram,
    svg: <BiLogoInstagram className='text-dark h-8 w-8' />
  },
  {
    name: 'Telegram',
    href: CONTACTS.telegram,
    svg: <BiLogoTelegram className='text-dark h-8 w-8' />
  },
  {
    name: 'Instagram2',
    href: CONTACTS.instagram2,
    svg: <BiLogoInstagram className='text-dark h-8 w-8' />
  },
  {
    name: 'Telegram2',
    href: CONTACTS.telegram2,
    svg: <BiLogoTelegram className='text-dark h-8 w-8' />
  }
]
