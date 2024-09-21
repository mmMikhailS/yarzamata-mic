import { PrismaService } from '../../prisma/prisma.service';
export declare class TokenRepository {
    private prisma;
    constructor(prisma: PrismaService);
    findUserByToken(refreshToken: string): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        refreshToken: string;
        userId: number;
    }>;
    deleteAllTokens(userId: number): Promise<import(".prisma/client").Prisma.BatchPayload>;
    create(refreshToken: string, userId: number): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        refreshToken: string;
        userId: number;
    }>;
    update(refreshToken: string, id: number): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        refreshToken: string;
        userId: number;
    }>;
}
