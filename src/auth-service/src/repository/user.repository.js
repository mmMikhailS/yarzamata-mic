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
exports.UserRepository = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let UserRepository = class UserRepository {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findUserById(id) {
        return await this.prisma.user.findUnique({
            where: {
                id,
            },
        });
    }
    async findUserByEmail(email) {
        return await this.prisma.user.findUnique({
            where: {
                email,
            },
        });
    }
    async updateUser(email, password) {
        return await this.prisma.user.update({
            where: {
                email,
            },
            data: {
                password,
            },
            select: {
                id: true,
                isAdmin: true,
                fullName: true,
            },
        });
    }
    async createUser(email, password, fullName) {
        return await this.prisma.user.create({
            data: {
                email,
                password,
                fullName,
            },
        });
    }
    async deleteUser(id) {
        return await this.prisma.user.delete({
            where: {
                id,
            },
        });
    }
};
exports.UserRepository = UserRepository;
exports.UserRepository = UserRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], UserRepository);
//# sourceMappingURL=user.repository.js.map