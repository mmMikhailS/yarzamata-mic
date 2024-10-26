import { OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { AppService } from './app.service';
import { registrationUserDto } from './dto/authDto/registrationUserDto.dto';
import { loginDto } from './dto/authDto/login.dto';
import { changePassDto } from './dto/authDto/changePass.dto';
export declare class AppController implements OnModuleInit, OnModuleDestroy {
    private readonly authService;
    private consumer;
    private producer;
    constructor(authService: AppService);
    onModuleInit(): Promise<void>;
    onModuleDestroy(): Promise<void>;
    register(data: registrationUserDto, messageId: string): Promise<void>;
    login(data: loginDto, messageId: string): Promise<void>;
    changePassword(data: changePassDto, messageId: string): Promise<void>;
    refresh(refreshToken: string, messageId: string): Promise<void>;
    activateAccount(data: {
        code: any;
        refreshToken: string;
    }, messageId: string): Promise<void>;
}
