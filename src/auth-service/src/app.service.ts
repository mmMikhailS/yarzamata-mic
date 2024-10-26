import {
  BadRequestException,
  Injectable,
  OnModuleDestroy,
  OnModuleInit,
  UnauthorizedException,
} from '@nestjs/common';
import * as argon2id from 'argon2';
import * as uuid from 'uuid';
import { UserRepository } from './repository/user.repository';
import { ActivateRepository } from './repository/activate.repository';
import { TokenService } from './services/token.service';
import { TokenRepository } from './repository/token.repository';
import { registrationUserDto } from './dto/authDto/registrationUserDto.dto';
import { userDto } from './dto/authDto/user.payload';
import { loginDto } from './dto/authDto/login.dto';
import { changePassDto } from './dto/authDto/changePass.dto';
import { kafka } from './kafka/kafka';

@Injectable()
export class AppService implements OnModuleInit, OnModuleDestroy {
  private producer: any;

  constructor(
    private userRepository: UserRepository,
    private activateRepository: ActivateRepository,
    private tokenService: TokenService,
    private tokenRepository: TokenRepository,
  ) {
    this.producer = kafka.producer();
  }

  async onModuleInit() {
    await this.producer.connect();
    console.log('producer connected');
  }

  async onModuleDestroy() {
    await this.producer.disconnect();
    console.log('producer disconnected');
  }

  async register(dto: registrationUserDto) {
    const candidate = await this.userRepository.findUserByEmail(dto.email);

    if (candidate) {
      throw new BadRequestException('User already  registered at this email');
    }
    if (dto.password !== dto.acceptPassword) {
      throw new BadRequestException('passwords not equals');
    }
    try {
      const hashPassword = await argon2id.hash(dto.acceptPassword);
      const activationCode = uuid.v4().replace(/\D/g, '').slice(0, 6);
      const activateLink = uuid.v4();
      const hashedActivationCode = await argon2id.hash(activationCode);

      const user = await this.userRepository.createUser(
        dto.email,
        hashPassword,
        dto.fullName,
      );

      const activateUser = await this.activateRepository.create(
        activateLink,
        hashedActivationCode,
        user.id,
      );

      const payload = new userDto(user);
      const tokens = await this.tokenService.generateTokens({ ...payload });
      await this.tokenRepository.create(tokens.refreshToken, user.id);

      await this.producer.send({
        topic: 'verification-mail',
        message: [
          { value: JSON.stringify({ to: dto.email, code: activationCode }) },
        ],
      });

      if (!tokens) {
        throw new BadRequestException('server error');
      }

      return {
        id: user.id,
        isActivated: activateUser.isActivated,
        activationLink: activateUser.activationLink,
        tokens,
      };
    } catch (e) {
      const deleteUser = await this.userRepository.findUserByEmail(dto.email);
      if (!deleteUser) {
        throw new BadRequestException(' register error ');
      }
      await this.tokenService.deleteAllTokens(deleteUser.id);
      await this.userRepository.deleteUser(deleteUser.id);
      return e;
    }
  }

  async login(dto: loginDto) {
    const user = await this.userRepository.findUserByEmail(dto.email);
    if (!user) {
      throw new UnauthorizedException('user not registered');
    }

    const isEqual = await argon2id.verify(user.password, dto.password);
    if (!isEqual) {
      throw new BadRequestException('Invalid password');
    }
    try {
      const activateUser = await this.activateRepository.findById(user.id);
      const payload = new userDto(user);
      const tokens = await this.tokenService.generateTokens({ ...payload });
      await this.tokenRepository.create(tokens.refreshToken, user.id);

      await this.producer.send({
        topic: 'login-mail',
        messages: [{ value: JSON.stringify({ to: dto.email, code: null }) }],
      });
      // this.mailGatewayController.LoginMail(dto.email);
      return {
        id: user.id,
        isActivated: activateUser.isActivated || false,
        activationLink: activateUser.activationLink,
        tokens,
      };
    } catch (e) {
      return e;
    }
  }

  async refresh(refreshToken: string) {
    if (!refreshToken) {
      throw new UnauthorizedException('user not signed');
    }

    const verifyToken = await this.tokenService.verify(refreshToken);
    if (!verifyToken) {
      throw new UnauthorizedException('user not signed');
    }
    try {
      const user = await this.tokenRepository.findUserByToken(refreshToken);
      const payload = new userDto(user);
      const newTokens = await this.tokenService.generateTokens({ ...payload });

      await this.tokenRepository.update(refreshToken, verifyToken.userId);
      return {
        id: user.id,
        refreshToken: newTokens.refreshToken,
      };
    } catch (e) {
      return e;
    }
  }

  async changePassword(dto: changePassDto) {
    const user = await this.userRepository.findUserByEmail(dto.email);
    if (!user) throw new UnauthorizedException('user need to login');

    if (dto.newPassword !== dto.acceptNewPassword)
      throw new BadRequestException('passwords not equals');

    const isNewPassEqual = await argon2id.verify(
      user.password,
      dto.acceptNewPassword,
    );
    if (isNewPassEqual)
      throw new BadRequestException('old password equals new password');
    const isPassEqual = await argon2id.verify(user.password, dto.oldPassword);

    if (!isPassEqual) throw new BadRequestException('old passwords not equals');

    try {
      const hashedNewPassword = await argon2id.hash(dto.acceptNewPassword);
      const result = await this.userRepository.updateUser(
        dto.email,
        hashedNewPassword,
      );
      await this.producer.send({
        topic: 'change-password-mail',
        message: [{ value: JSON.stringify(dto.email, null) }],
      });

      return result;
    } catch (e) {
      return e;
    }
  }

  async activateAccount(code: any, refreshToken: string) {
    const token = await this.tokenRepository.findUserByToken(refreshToken);
    if (!token) {
      throw new UnauthorizedException('user not registered');
    }
    const activateUser = await this.activateRepository.findById(token.userId);
    if (!activateUser) {
      throw new UnauthorizedException('user not registered');
    }
    const isEqual = argon2id.verify(activateUser.activationCode, code.code);
    if (!isEqual) {
      throw new BadRequestException('invalid code');
    }

    const result = await this.activateRepository.updateActivate(
      activateUser.userId,
    );
    return {
      id: result.id,
      activationLink: result.activationLink,
      isActivated: result.isActivated,
    };
  }
}
