import { Controller, InternalServerErrorException } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { registrationUserDto } from './dto/authDto/registrationUserDto.dto';
import { loginDto } from './dto/authDto/login.dto';
import { changePassDto } from './dto/authDto/changePass.dto';
import { AppService } from './app.service';

@Controller('auth')
export class AppController {
  constructor(private readonly authService: AppService) {}

  @MessagePattern({ cmd: 'get-register-user' })
  async get() {
    return 'register';
  }

  @MessagePattern({ cmd: 'register-user' })
  async register(dto: registrationUserDto) {
    try {
      console.log(1);
      const register = await this.authService.register(dto);
      if (!register) {
        throw new InternalServerErrorException('something went wrong');
      }

      return register;
    } catch (e) {
      throw e.message;
    }
  }

  @MessagePattern({ cmd: 'get-login-user' })
  async getlogin() {
    return 'login';
  }

  @MessagePattern({ cmd: 'login-user' })
  async login(dto: loginDto) {
    console.log(1);
    try {
      return await this.authService.login(dto);
    } catch (e) {
      throw e.message;
    }
  }

  @MessagePattern({ cmd: 'get-change-password' })
  async getChangePassword() {
    return 'changePassword';
  }

  @MessagePattern({ cmd: 'change-password' })
  async changePassword(dto: changePassDto) {
    return await this.authService.changePassword(dto);
  }

  @MessagePattern({ cmd: 'get-refresh' })
  async getRefresh() {
    return 'refresh';
  }

  @MessagePattern({ cmd: 'refresh' })
  async refresh(refreshToken: string) {
    try {
      return await this.authService.refresh(refreshToken);
    } catch (e) {
      throw e;
    }
  }

  @MessagePattern({ cmd: 'get-activate-account' })
  async activateAccountg() {
    return 'activateAccount';
  }

  @MessagePattern({ cmd: 'activate-account' })
  async activateAccount(code: string, refreshToken: string) {
    try {
      return await this.authService.activateAccount(code, refreshToken);
    } catch (e) {
      throw e;
    }
  }
}
