import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { registrationUserDto } from './dto/authDto/registrationUserDto.dto';
import { loginDto } from './dto/authDto/login.dto';
import { changePassDto } from './dto/authDto/changePass.dto';

@Injectable()
export class AuthGatewayService {
  constructor(
    @Inject('AUTH_SERVICE') private readonly authClient: ClientProxy,
    @Inject('MAIL_SERVICE') private readonly mailClient: ClientProxy,
  ) {}

  getRegister() {
    return this.authClient.send({ cmd: 'get-register-user' }, {});
  }

  register(dto: registrationUserDto) {
    try {
      const register: any = this.authClient.send({ cmd: 'register-user' }, dto);

      this.mailClient.send(
        { cmd: 'verification-mail' },
        { to: dto.email, code: register.code },
      );

      return register;
    } catch (e) {
      throw e;
    }
  }

  login(dto: loginDto) {
    try {
      return this.authClient.send({ cmd: 'login-user' }, dto);
    } catch (e) {
      throw e;
    }
  }

  changePassword(dto: changePassDto) {
    try {
      const changePassword: any = this.authClient.send(
        { cmd: 'change-password' },
        dto,
      );
      return changePassword;
    } catch (e) {
      throw e;
    }
  }

  refresh(refreshToken: string) {
    try {
      const refreshed: any = this.authClient.send(
        { cmd: 'refresh' },
        { refreshToken },
      );
      return refreshed;
    } catch (e) {
      throw e;
    }
  }

  activateAccount(code: string, refreshToken: string) {
    try {
      const activated: any = this.authClient.send(
        { cmd: 'activate-account' },
        { code, refreshToken },
      );
      return activated;
    } catch (e) {
      throw e;
    }
  }
}
