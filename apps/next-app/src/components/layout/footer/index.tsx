import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion'

import Contacts from './contacts'
import Copyright from './copyright'
import CreatedBy from './created-by'
import Links from './links'
import Logo from './logo'
import Pages from './pages'
import Problem from './problem'

const Footer: React.FC = () => {
  return (
    <footer className='flex w-full flex-row flex-wrap justify-between py-4 md:py-10 lg:py-16'>
      <section id='mobile' className='flex w-full flex-col lg:hidden'>
        <Accordion type='single' collapsible>
          <AccordionItem value='links'>
            <AccordionTrigger>Our Socials:</AccordionTrigger>
            <AccordionContent>
              <Links />
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value='contacts'>
            <AccordionTrigger>Contacts:</AccordionTrigger>
            <AccordionContent>
              <Contacts />
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value='pages'>
            <AccordionTrigger>Pages:</AccordionTrigger>
            <AccordionContent>
              <Pages />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        <div className='flex flex-col items-center justify-center'>
          <Logo />
          <Problem />
          <Copyright />
          <CreatedBy />
        </div>
      </section>
      <section
        id='desktop-footer'
        className='hidden w-full flex-wrap justify-between gap-5 lg:flex'
      >
        <div>
          <Logo />
          <Problem />
        </div>
        <div>
          <Contacts title='Contacts:' />
        </div>
        <div>
          <Pages title='Pages:' />
        </div>
        <div className='flex flex-col items-center'>
          <Links title='Our Socials:' />
          <Copyright className='!mt-10' />
          <CreatedBy />
        </div>
      </section>
    </footer>
  )
}

export default Footer
