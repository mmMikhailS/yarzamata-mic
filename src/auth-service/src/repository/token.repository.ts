import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class TokenRepository {
  constructor(private prisma: PrismaService) {}

  async findUserByToken(refreshToken: string) {
    return await this.prisma.token.findFirst({
      where: {
        refreshToken,
      },
    });
  }

  async deleteAllTokens(userId: number) {
    return await this.prisma.token.deleteMany({
      where: {
        userId,
      },
    });
  }

  async create(refreshToken: string, userId: number) {
    return await this.prisma.token.create({
      data: {
        refreshToken,
        userId,
      },
    });
  }

  async update(refreshToken: string, id: number) {
    return await this.prisma.token.update({
      where: {
        id,
      },
      data: {
        refreshToken,
      },
    });
  }
}
