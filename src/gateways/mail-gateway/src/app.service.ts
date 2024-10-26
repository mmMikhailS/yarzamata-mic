import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy, EventPattern } from '@nestjs/microservices';

@Injectable()
export class MailGatewayService {
  constructor(@Inject('MAIL_SERVICE') private mailService: ClientProxy) {}

  @EventPattern({ cmd: 'verify-email-mail' })
  VerificationMail(to: string, code: string) {
    try {
      const result: any = this.mailService.emit(
        { cmd: 'verification-mail' },
        { to, code },
      );
      return result;
    } catch (e) {
      return e;
    }
  }

  @EventPattern({ cmd: 'login-mail' })
  LoginMail(to: string) {
    try {
      const result: any = this.mailService.emit({ cmd: 'login-mail' }, { to });
      return result;
    } catch (e) {
      return e;
    }
  }

  @EventPattern({ cmd: 'change-pass-mail' })
  ChangedPasswordMail(to: string) {
    try {
      const result: any = this.mailService.emit(
        { cmd: 'change-password-mail' },
        { to },
      );
      return result;
    } catch (e) {
      return e;
    }
  }
}
