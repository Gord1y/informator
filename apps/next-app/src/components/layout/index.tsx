import { PropsWithChildren } from 'react'

import Footer from './footer'
import Header from './header'
import Main from './main'
import Providers from './providers'
import { ICurrentUser } from '@/interfaces/user/user.interface'

interface Props {
  currentUser: ICurrentUser
}

const Layout: React.FC<PropsWithChildren<Props>> = ({
  children,
  currentUser
}) => {
  return (
    <Providers currentUser={currentUser}>
      <Header />
      <Main>{children}</Main>
    </Providers>
  )
}

export default Layout
