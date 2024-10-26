import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { registrationUserDto } from './dto/authDto/registrationUserDto.dto';
import { loginDto } from './dto/authDto/login.dto';
import { changePassDto } from './dto/authDto/changePass.dto';
import { v4 as uuidv4 } from 'uuid';
import {
  activateAccountPromise,
  changePasswordPromise,
  loginPromise,
  Message,
  refreshPromise,
  registrationPromise,
  topicsType,
} from './utils/utils';
import { kafka } from './kafka/kafka';

@Injectable()
export class AuthGatewayService implements OnModuleInit, OnModuleDestroy {
  producer: any;

  private async promiseSendMessage(
    data: any,
    promiseMap: any,
    topic: topicsType,
  ) {
    const promise = this.promiseMessage(promiseMap);

    await this.producer
      .send({
        topic,
        messages: [
          { value: JSON.stringify(new Message(data, promise.messageId)) },
        ],
      })
      .then((result) => {
        console.log('message sent: ' + result);
        return result;
      })
      .catch((e) => {
        console.error(`payment gateway error: ` + e);
        throw e;
      });
    // this.mailClient.emit(
    //   { cmd: 'verification-mail' },
    //   { to: dto.email, code: register.code },
    // );
    return await promise.promise;
  }

  private promiseMessage(mapPromise: Map<any, any>) {
    const messageId = uuidv4();
    const promise = new Promise((resolve, reject) => {
      mapPromise.set(messageId, { resolve, reject });
    });
    return { messageId, promise };
  }

  constructor() {
    this.producer = kafka.producer();
  }

  async onModuleInit() {
    try {
      await this.producer.connect();
      console.log('producer connected');
    } catch (e) {
      console.error('Error connecting to Kafka', e);
      throw e;
    }
  }

  async onModuleDestroy() {
    await this.producer.disconnect();
    console.log('producer disconnected');
  }

  async register(dto: registrationUserDto) {
    try {
      return await this.promiseSendMessage(
        dto,
        registrationPromise,
        'register-user',
      );
    } catch (e) {
      console.error('Error in register method', e);
      throw e;
    }
  }

  async login(dto: loginDto) {
    try {
      return await this.promiseSendMessage(dto, loginPromise, 'login-user');
      // this.mailClient.emit(
      //   {cmd: ''},
      //   {to: dto.email}
      // )
    } catch (e) {
      throw e;
    }
  }

  async changePassword(dto: changePassDto) {
    try {
      return await this.promiseSendMessage(
        dto,
        changePasswordPromise,
        'change-password',
      );
    } catch (e) {
      throw e;
    }
  }

  async refresh(refreshToken: string) {
    try {
      return await this.promiseSendMessage(
        refreshToken,
        refreshPromise,
        'refresh',
      );
    } catch (e) {
      throw e;
    }
  }

  async activateAccount(data: { code: string; refreshToken: string }) {
    try {
      return await this.promiseSendMessage(
        data,
        activateAccountPromise,
        'activate-account',
      );
    } catch (e) {
      throw e;
    }
  }
}
