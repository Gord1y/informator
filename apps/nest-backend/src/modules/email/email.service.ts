import { MailerService } from '@nestjs-modules/mailer'
import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/modules/prisma/prisma.service'

@Injectable()
export class EmailService {
  constructor(
    private readonly mailerService: MailerService,
    private readonly prisma: PrismaService
  ) {}

  private templateCache = new Map<string, any>()

  private async getTemplate(name: string) {
    const cached = this.templateCache.get(name)
    if (cached && cached.cashUntil > new Date()) {
      return cached.template
    }

    const template = await this.prisma.emailTemplate.findFirst({
      where: { name }
    })

    if (!template) {
      throw new Error(`Template with name ${name} not found`)
    }

    this.templateCache.set(name, {
      template,
      cashUntil: new Date(Date.now() + 1000 * 60 * 60 * 6) // 6 hour cache
    })

    return template
  }

  private replaceTemplateVariables(
    html: string,
    context: Record<string, any>
  ): string {
    return html.replace(
      /{{(\w+)}}/g,
      (match, variable) => context[variable] || match
    )
  }

  async sendTemplateEmail(
    email: string,
    subject: string,
    templateName: string,
    context: Record<string, any>
  ) {
    const template = await this.getTemplate(templateName)
    await this.mailerService.sendMail({
      to: email,
      subject,
      html: this.replaceTemplateVariables(template.html, context)
    })
  }
}
