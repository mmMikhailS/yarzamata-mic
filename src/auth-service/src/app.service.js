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
exports.AppService = void 0;
const common_1 = require("@nestjs/common");
const argon2id = require("argon2");
const uuid = require("uuid");
const user_repository_1 = require("./repository/user.repository");
const activate_repository_1 = require("./repository/activate.repository");
const token_service_1 = require("./services/token.service");
const token_repository_1 = require("./repository/token.repository");
const user_payload_1 = require("./dto/authDto/user.payload");
let AppService = class AppService {
    constructor(userRepository, activateRepository, tokenService, tokenRepository) {
        this.userRepository = userRepository;
        this.activateRepository = activateRepository;
        this.tokenService = tokenService;
        this.tokenRepository = tokenRepository;
    }
    async register(dto) {
        const candidate = await this.userRepository.findUserByEmail(dto.email);
        if (candidate) {
            throw new common_1.BadRequestException('User already  registered at this email');
        }
        if (dto.password !== dto.acceptPassword) {
            throw new common_1.BadRequestException('passwords not equals');
        }
        try {
            const hashPassword = await argon2id.hash(dto.acceptPassword);
            const activationCode = uuid.v4().replace(/\D/g, '').slice(0, 6);
            const activateLink = uuid.v4();
            const hashedActivationCode = await argon2id.hash(activationCode);
            const user = await this.userRepository.createUser(dto.email, hashPassword, dto.fullName);
            const activateUser = await this.activateRepository.create(activateLink, hashedActivationCode, user.id);
            const payload = new user_payload_1.userDto(user);
            const tokens = await this.tokenService.generateTokens({ ...payload });
            await this.tokenRepository.create(tokens.refreshToken, user.id);
            if (!tokens) {
                throw new common_1.BadRequestException('server error');
            }
            return {
                id: user.id,
                isActivated: activateUser.isActivated,
                activationLink: activateUser.activationLink,
                tokens,
            };
        }
        catch (e) {
            const deleteUser = await this.userRepository.findUserByEmail(dto.email);
            if (!deleteUser) {
                throw new common_1.BadRequestException(' register error ');
            }
            await this.tokenService.deleteAllTokens(deleteUser.id);
            await this.userRepository.deleteUser(deleteUser.id);
            return e;
        }
    }
    async login(dto) {
        const user = await this.userRepository.findUserByEmail(dto.email);
        if (!user) {
            throw new common_1.UnauthorizedException('user not registered');
        }
        const isEqual = await argon2id.verify(user.password, dto.password);
        if (!isEqual) {
            throw new common_1.BadRequestException('Invalid password');
        }
        try {
            const activateUser = await this.activateRepository.findById(user.id);
            const payload = new user_payload_1.userDto(user);
            const tokens = await this.tokenService.generateTokens({ ...payload });
            await this.tokenRepository.create(tokens.refreshToken, user.id);
            return {
                id: user.id,
                isActivated: activateUser.isActivated,
                activationLink: activateUser.activationLink,
                tokens,
            };
        }
        catch (e) {
            return e;
        }
    }
    async refresh(refreshToken) {
        if (!refreshToken) {
            throw new common_1.UnauthorizedException('user not signed');
        }
        const verifyToken = await this.tokenService.verify(refreshToken);
        if (!verifyToken) {
            throw new common_1.UnauthorizedException('user not signed');
        }
        try {
            const user = await this.tokenRepository.findUserByToken(refreshToken);
            const payload = new user_payload_1.userDto(user);
            const newTokens = await this.tokenService.generateTokens({ ...payload });
            await this.tokenRepository.update(refreshToken, verifyToken.userId);
            return {
                id: user.id,
                refreshToken: newTokens.refreshToken,
            };
        }
        catch (e) {
            return e;
        }
    }
    async changePassword(dto) {
        const user = await this.userRepository.findUserByEmail(dto.email);
        if (!user)
            throw new common_1.UnauthorizedException('user need to login');
        if (dto.newPassword !== dto.acceptNewPassword)
            throw new common_1.BadRequestException('passwords not equals');
        const isNewPassEqual = await argon2id.verify(user.password, dto.acceptNewPassword);
        if (isNewPassEqual)
            throw new common_1.BadRequestException('old password equals new password');
        const isPassEqual = await argon2id.verify(user.password, dto.oldPassword);
        if (!isPassEqual)
            throw new common_1.BadRequestException('old passwords not equals');
        try {
            const hashedNewPassword = await argon2id.hash(dto.acceptNewPassword);
            const result = await this.userRepository.updateUser(dto.email, hashedNewPassword);
            return result;
        }
        catch (e) {
            return e;
        }
    }
    async activateAccount(code, refreshToken) {
        const token = await this.tokenRepository.findUserByToken(refreshToken);
        if (!token) {
            throw new common_1.UnauthorizedException('user not registered');
        }
        const activateUser = await this.activateRepository.findById(token.userId);
        if (!activateUser) {
            throw new common_1.UnauthorizedException('user not registered');
        }
        const isEqual = argon2id.verify(activateUser.activationCode, code.code);
        if (!isEqual) {
            throw new common_1.BadRequestException('invalid code');
        }
        const result = await this.activateRepository.updateActivate(activateUser.userId);
        return {
            id: result.id,
            activationLink: result.activationLink,
            isActivated: result.isActivated,
        };
    }
};
exports.AppService = AppService;
exports.AppService = AppService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [user_repository_1.UserRepository,
        activate_repository_1.ActivateRepository,
        token_service_1.TokenService,
        token_repository_1.TokenRepository])
], AppService);
//# sourceMappingURL=app.service.js.map