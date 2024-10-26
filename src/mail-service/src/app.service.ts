import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class AppService {
  constructor(private mailerService: MailerService) {}

  async VerificationMail(to: string, code: string) {
    await this.mailerService
      .sendMail({
        to,
        subject: 'verification your email',
        template: 'verification',
        context: {
          activationCode: code,
        },
        text: `your verification code ${code}`,
      })
      .catch((e) => {
        console.log(JSON.stringify(e));
        throw new BadRequestException(JSON.stringify(e));
      });
  }

  async LoginMail(to: string, code: null) {
    await this.mailerService
      .sendMail({
        to,
        subject: 'Someone has  logged on your account',
        template: 'Someone logged',
        text: `Someone has  logged on your account`,
      })
      .catch((e) => {
        console.log(JSON.stringify(e));
        throw new BadRequestException(JSON.stringify(e));
      });
  }

  async ChangedPasswordMail(to: string, code: null) {
    await this.mailerService
      .sendMail({
        to,
        subject: 'Someone has  changed password on your account',
        template: 'Someone changed password',
        text: `Someone has changed password on your account`,
      })
      .catch((e) => {
        console.log(JSON.stringify(e));
        throw new BadRequestException(JSON.stringify(e));
      });
  }
}
