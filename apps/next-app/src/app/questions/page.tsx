import { Metadata } from 'next'
import Link from 'next/link'

import Heading from '@/components/layout/heading'
import Section from '@/components/layout/section'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion'

import { QUESTIONS } from '@/config/questions'

export const metadata: Metadata = {
  title: 'Q&A',
  description: 'Q&A'
}

export default function QuestionsPage() {
  return (
    <Section disableMaxWidth className='flex flex-col gap-2'>
      <Heading>QUESTIONS and ANSWERS</Heading>
      <p>
        If you don't found your question,  -{' '}
        <Link href={'contact-us'} className='text-primary'>
          contact us
        </Link>
        . We will be happy to help you!
      </p>
      <Accordion type='single' collapsible defaultValue='0'>
        {QUESTIONS.map((question, index) => (
          <AccordionItem key={index} value={index.toString()}>
            <AccordionTrigger className='text-primary/90'>
              {question.title}
            </AccordionTrigger>
            <AccordionContent>{question.content}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </Section>
  )
}
