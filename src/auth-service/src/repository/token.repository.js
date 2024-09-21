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
exports.TokenRepository = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let TokenRepository = class TokenRepository {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findUserByToken(refreshToken) {
        return await this.prisma.token.findFirst({
            where: {
                refreshToken,
            },
        });
    }
    async deleteAllTokens(userId) {
        return await this.prisma.token.deleteMany({
            where: {
                userId,
            },
        });
    }
    async create(refreshToken, userId) {
        return await this.prisma.token.create({
            data: {
                refreshToken,
                userId,
            },
        });
    }
    async update(refreshToken, id) {
        return await this.prisma.token.update({
            where: {
                id,
            },
            data: {
                refreshToken,
            },
        });
    }
};
exports.TokenRepository = TokenRepository;
exports.TokenRepository = TokenRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], TokenRepository);
//# sourceMappingURL=token.repository.js.map