import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class MailGatewayService {
  constructor(@Inject('MAIL_SERVICE') private mailService: ClientProxy) {}

  VerificationMail(to: string, code: string) {
    try {
      const result: any = this.mailService.send(
        { cmd: 'verification-mail' },
        { to, code },
      );
      return result;
    } catch (e) {
      return e;
    }
  }

  LoginMail(to: string) {
    try {
      const result: any = this.mailService.send({ cmd: 'login-mail' }, { to });
      return result;
    } catch (e) {
      return e;
    }
  }

  ChangedPasswordMail(to: string) {
    try {
      const result: any = this.mailService.send(
        { cmd: 'change-password-mail' },
        { to },
      );
      return result;
    } catch (e) {
      return e;
    }
  }
}
