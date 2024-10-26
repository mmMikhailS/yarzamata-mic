"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppController = void 0;
const kafka_1 = require("./kafka/kafka");
const registrationUserDto_dto_1 = require("./dto/authDto/registrationUserDto.dto");
const login_dto_1 = require("./dto/authDto/login.dto");
const changePass_dto_1 = require("./dto/authDto/changePass.dto");
const microservices_1 = require("@nestjs/microservices");
class AppController {
    constructor(authService) {
        this.authService = authService;
        this.consumer = kafka_1.kafka.consumer({ groupId: 'auth' });
        this.producer = kafka_1.kafka.producer();
    }
    async onModuleInit() {
        await this.producer.connect();
        await this.consumer.connect();
        console.log('consumer and producer connected');
        await this.consumer.run();
    }
    async onModuleDestroy() {
        await this.producer.disconnect();
        await this.consumer.disconnect();
        console.log('consumer disconnected');
    }
    async register(data, messageId) {
        const result = await this.authService.register(data);
        const message = {
            data: result,
            messageId,
        };
        await this.producer.send({ cmd: 'register-user-response' }, message);
    }
    async login(data, messageId) {
        const result = await this.authService.login(data);
        const message = {
            data: result,
            messageId,
        };
        await this.producer.send({ cmd: 'login-user-response' }, message);
    }
    async changePassword(data, messageId) {
        const result = await this.authService.changePassword(data);
        const message = {
            data: result,
            messageId,
        };
        await this.producer.send({ cmd: 'change-password-response' }, message);
    }
    async refresh(refreshToken, messageId) {
        const result = await this.authService.refresh(refreshToken);
        const message = {
            data: result,
            messageId,
        };
        await this.producer.send({ cmd: 'refresh-response' }, message);
    }
    async activateAccount(data, messageId) {
        const result = await this.authService.activateAccount(data.code, data.refreshToken);
        const message = {
            data: result,
            messageId,
        };
        await this.producer.send({ cmd: 'activate-account-response' }, message);
    }
}
exports.AppController = AppController;
__decorate([
    (0, microservices_1.MessagePattern)({ cmd: 'register-user' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [registrationUserDto_dto_1.registrationUserDto, String]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "register", null);
__decorate([
    (0, microservices_1.MessagePattern)({ cmd: 'login-user' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [login_dto_1.loginDto, String]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "login", null);
__decorate([
    (0, microservices_1.MessagePattern)({ cmd: 'change-password' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [changePass_dto_1.changePassDto, String]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "changePassword", null);
__decorate([
    (0, microservices_1.MessagePattern)({ cmd: 'refresh' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "refresh", null);
__decorate([
    (0, microservices_1.MessagePattern)({ cmd: 'activate-account' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "activateAccount", null);
//# sourceMappingURL=app.controller.js.map