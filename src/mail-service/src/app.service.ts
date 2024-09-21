import { Injectable } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class AppService {
  constructor(private mailerService: MailerService) {}

  async sendMail(
    to: string,
    subject: string,
    template: string,
    context: any,
    name: string,
    activationLink: string,
  ) {
    await this.mailerService.sendMail({
      to,
      subject,
      template,
      context: {
        name,
        activationLink,
      },
    });
  }

  @MessagePattern({ cmd: 'verification-mail' })
  async VerificationMail(to: string, code: string) {
    await this.mailerService.sendMail({
      to,
      subject: 'verificate your email',
      template: 'verificate',
      context: {
        activationCode: code,
      },
      text: `your verification code ${code}`,
    });
  }

  @MessagePattern({ cmd: 'login-mail' })
  async LoginMail(to: string) {
    await this.mailerService.sendMail({
      to,
      subject: 'Someone has  logged on your account',
      template: 'Someone logged',
      text: `Someone has  logged on your account`,
    });
  }

  @MessagePattern({ cmd: 'change-password-mail' })
  async ChangedPasswordMail(to: string) {
    await this.mailerService.sendMail({
      to,
      subject: 'Someone has  changed password on your account',
      template: 'Someone changed password',
      text: `Someone has changed password on your account`,
    });
  }
}
